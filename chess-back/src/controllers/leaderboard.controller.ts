import { Body, Controller, Delete, Get, Patch, Path, Post, Request, Route, Security, Tags } from "tsoa";
import { LeaderboardDTO } from "../dto/leaderboard.dto";
import { leaderboardService } from "../services/leaderboard.service";
import { Request as ExpressRequest } from 'express';

@Route("leaderboard")
@Tags("Leaderboard")
export class LeaderboardController extends Controller {

    @Get("/")
    public async getLeaderboard(): Promise<LeaderboardDTO | null> {
        const leaderboard = await leaderboardService.getLeaderboard();
        return leaderboard;
    }

    @Get("/history")
    @Security("jwt", [])
    public async getUserGame(@Request() req: ExpressRequest){
        const games = await leaderboardService.getUserGames(req.user.id);
        return games;
    }

    @Get("/history/{userId}")
    public async getLeaderboardUser(@Request() req: ExpressRequest, @Path() userId: number){
        const games = await leaderboardService.getLeaderboardUser(userId);
        return games;
    }

}