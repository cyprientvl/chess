import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Request, Security, Tags } from "tsoa";
import { UserDTO } from "../dto/user.dto";
import { userService } from "../services/user.service";
import { CreateUserBody } from "../interfaces/createUserBody.interface";
import { UpdateUser } from "../interfaces/updateUser.interface";
import { Request as ExpressRequest } from 'express';

@Route("users")
@Tags("Users")
export class UserController extends Controller {

  @Get("{id}")
  @Security("jwt", [])
  public async getUser(@Path() id: number): Promise<UserDTO | null> {
    const user = await userService.getUser(id);
    if (!user) {
      this.setStatus(404);
      return null;
    }
    return user;
  }

  @Post("/")
  public async createUser(@Body() requestBody: CreateUserBody): Promise<UserDTO | null> {
    const user = await userService.createUser(requestBody);
    if (!user) {
      this.setStatus(401);
      return null;
    }
    return user;
  }

  @Security("jwt", [])
  @Delete("{id}")
  public async deleteUser(@Path() id: number): Promise<void> {
    await userService.deleteUser(id);
  }

  @Security("jwt", [])
  @Patch("/")
  public async updateUser(@Request() req: ExpressRequest, @Body() body: UpdateUser): Promise<{ success: boolean }> {
    const response = await userService.updateUser(req.user.id, body);

    if (response.success) {
      this.setStatus(200);
      return { success: true };
    } else {
      switch (response.error) {
        case "USERNAME_ALREADY_EXISTS":
          this.setStatus(409);
          return { success: false };
        case "INCORRECT_PASSWORD":
          this.setStatus(401);
          return { success: false };
        case "PASSWORD_NOT_MATCH":
          this.setStatus(400);
          return { success: false };
        default:
          this.setStatus(500);
          return { success: false };
      }
    }
  }
}