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

    public async updateUser(updateUser: UpdateUser): Promise<UserDTO | null> {

        const user = await this.getUser(updateUser.id);

        if(!user){
            return null;
        }

        if(updateUser.username) user.username = updateUser.username;
        if(updateUser.password){
            const passwordBase64 = Buffer.from(updateUser.password).toString('base64');
            user.password = passwordBase64;
        }

        await user.save();
        return await this.getUser(updateUser.id);
    }

}

export const userService = new UserService();
