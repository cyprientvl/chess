import { AuthBody } from "../interfaces/AuthBody";
import { userService } from "./user.service";
const jwt = require("jsonwebtoken");
const env = require('dotenv').config()

export class AuthService {

    
    public async auth(authBody: AuthBody): Promise<string | null>{

        const {username, password} = authBody;

        const user = await userService.getUserByUsername(username);

        if(!user) return null;
        if(user.password == Buffer.from(password).toString('base64')){
            
            let roles: string[] = []
            console.log(user.role);
            switch (user.role) {
                case "admin":
                    roles = ['user:read', 'user:write', 'user:delete']
                    break;
                case "gerant":
                    roles = ['user:read', 'user:write', 'user:delete:bookCollection']
                    break;
                case "user":
                    roles = ['user:red', 'user:write:book']
                    break;
                default:
                    break;
            }
            const token = await jwt.sign({ id: user.id, username: user.username, roles: roles }, process.env.SECRET_TOKEN);
            return token
        }

        return null;
    }
    
}

export const authService = new AuthService();
