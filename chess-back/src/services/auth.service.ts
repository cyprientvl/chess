import { AuthBody } from "../interfaces/authBody.interface";
import { userService } from "./user.service";
const jwt = require("jsonwebtoken");
const env = require('dotenv').config()

export class AuthService {

    
    public async auth(authBody: AuthBody): Promise<string | null>{

        const {username, password} = authBody;

        const user = await userService.getUserByUsername(username);

        if(!user) return null;
        if(user.password == Buffer.from(password).toString('base64')){
            
            const token = await jwt.sign({ id: user.id, username: user.username }, "secret");
            return token
        }

        return null;
    }
    
}

export const authService = new AuthService();
