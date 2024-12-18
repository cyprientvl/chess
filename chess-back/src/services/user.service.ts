import { UserDTO } from "../dto/user.dto";
import { CreateUserBody } from "../interfaces/createUserBody.interface";
import { UpdateUser } from "../interfaces/updateUser.interface";
import { User } from "../models/user.model";


export class UserService {
 
    public async getUser(id: number): Promise<User | null>{
        return await User.findByPk(id);
    }

    public async getUserByUsername(username: string): Promise<User | null>{
        return await User.findOne({where: {username: username}})
    }

    public async createUser(requestBody: CreateUserBody): Promise<UserDTO | null>{

        const {username, password} = requestBody;

        const user = await this.getUserByUsername(username);

        if(user){
            return null;
        }

        const passwordBase64 = Buffer.from(password).toString('base64');

        return await User.create({password: passwordBase64, username: username, role: "user"});

    }

    public async deleteUser(id: number): Promise<void>{

        const user = await this.getUser(id);

        if(!user){
            throw new Error("User not found");
        }

        await user.destroy()

    }

    public async updateUser(userId: number, updateUser: UpdateUser): Promise<{success: boolean, error: string}> {

        const user = await this.getUser(userId);

        if(!user){
            return {success: false, error: "UNKNOW_ERROR"};
        }

        if(user.password == Buffer.from(updateUser.old_password).toString('base64')){
        
            
            if(updateUser.username){
            
                const verifyUsername = await this.getUserByUsername(updateUser.username);
                if(verifyUsername != null) return {success: false, error: "USERNAME_ALREADY_EXISTS"};
                user.username = updateUser.username;
            
            }
            
            if(updateUser.new_password && updateUser.new_password == updateUser.new_password_confirm){
                const passwordBase64 = Buffer.from(updateUser.new_password).toString('base64');
                user.password = passwordBase64;
            }

            await user.save();
            return {success: true, error: ""};


        }

        return {success: false, error: "INCORRECT_PASSWORD"};
    }

}

export const userService = new UserService();
