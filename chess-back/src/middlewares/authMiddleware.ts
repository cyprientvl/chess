import { Request} from "express";
import { UserDTO } from "../dto/user.dto";
const jwt = require("jsonwebtoken");

export const expressAuthentication = async (req: Request, securityName: string, scopes?: string[]) => {
  return new Promise((resolve, reject) =>{
    const authorization = req.headers.authorization;

    if (!authorization) {
      return reject({ message: "Authorization header missing" });
    }
    
    try {
        const token = authorization.split(' ')[1];
  
        if (!token) {
          return reject({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, "secret");
        req.user = {id: decoded.id};

        resolve(decoded);
    } catch (err) {
        return reject({ message: "Invalid token" });

    }
  })
  
};

