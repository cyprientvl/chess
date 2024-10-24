import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, Tags } from "tsoa";
import { CreateGameBody } from "../interfaces/createGameBody";
import { GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";
import { InsertActionBody } from "../interfaces/insertActionBody.interface";

@Route("game")
@Tags("Games")
export class GameController extends Controller {

    @Post("/")
    public async createGame(@Body() requestBody: CreateGameBody): Promise<GameDTO> {
      return await gameService.createGame(requestBody);
    }

    @Post("{id}/action")
    public async movePiece(@Body() requestBody: InsertActionBody, @Path() id: number){
        return await gameService.addAction(requestBody, id);
    }

  /*@Get("{id}")
  @Security("jwt", ['user:read'])
  public async getUser(@Path() id: number): Promise<UserDTO | null> {
    const user = await userService.getUser(id);
    if (!user) {
      this.setStatus(404);
      return null;
    }
    return user;
  }

  @Security("jwt", ['user:write'])
  @Post("/")
  public async createUser(@Body() requestBody: CreateUserBody): Promise<UserDTO> {
    return await userService.createUser(requestBody);
  }

  @Security("jwt", ['user:delete'])
  @Delete("{id}")
  public async deleteUser(@Path() id: number): Promise<void> {
    await userService.deleteUser(id);
  }

  @Security("jwt", ['user:write'])
  @Patch("/")
  public async updateUser(@Body() body: UpdateUser): Promise<UserDTO | null> {
    return await userService.updateUser(body);
  }*/


}