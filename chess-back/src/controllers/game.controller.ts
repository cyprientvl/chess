import { Body, Controller, Delete, Get, Patch, Path, Post, Request, Route, Security, Tags } from "tsoa";
import { CreateGameBody } from "../interfaces/createGameBody";
import { GameDTO } from "../dto/game.dto";
import { gameService } from "../services/game.service";
import { Request as ExpressRequest } from 'express'; // Pour typage de la requête
import { MovePiece } from "../interfaces/movePiece.interface";
@Route("game")
@Tags("Games")
export class GameController extends Controller {

    @Post("/move")
    @Security("jwt", [])
    public async move(@Request() req: ExpressRequest, @Body() requestBody: MovePiece){
      const response = await gameService.move(req.user.id, requestBody);

      if(!response){
        this.setStatus(404);
        return null;
      }

      return response;
    }

    @Post("/")
    @Security("jwt", [])
    public async createGame(@Body() requestBody: CreateGameBody, @Request() req: ExpressRequest): Promise<{gameId: number}> {
      console.log("=== " + req.user.id);

      const rep = await gameService.createGame(requestBody, req.user.id);

      if(!rep){
        this.setStatus(500);
        return {gameId: -1};
      }

      return {gameId: req.user.id}
    }

    @Get("/")
    @Security("jwt", [])
    public async getGame(@Request() req: ExpressRequest){
      const game = gameService.getGame(req.user.id);
      if(!game){
        this.setStatus(404);
        return null;
      }
      return game;
    }

    @Get("/user-game")
    @Security("jwt", [])
    public async getUserGameId(@Request() req: ExpressRequest){
      return {gameId: gameService.getUserGameId(req.user.id)};
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