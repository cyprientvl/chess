import { Body, Controller, Middlewares, Post, Route, Security, Tags } from "tsoa";
import { UserDTO } from "../dto/user.dto";
import { AuthBody } from "../interfaces/AuthBody";
import { authService } from "../services/auth.service";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {

  @Post("/")
  public async auth(@Body() bodyAuth: AuthBody): Promise<{token: string} | null>{
    const token = await authService.auth(bodyAuth);

    if(bodyAuth.grant_type != 'password'){
      let error = new Error("Invalid grant_type");
      (error as any).status = 400;
      throw error;      
    }

    if(!token){
        this.setStatus(404);
        return null;
    }

    return {token: token};
  }
}