import { Controller, Get, Path, Request, Route, Security, Tags } from "tsoa";
import { leaderboardService } from "../services/leaderboard.service";
import { Request as ExpressRequest } from 'express';
import { LeaderboardEntryDTO } from "../dto/leaderboard.dto";

@Route("leaderboards")
@Tags("Leaderboard")
export class LeaderboardController extends Controller {

    @Get("/")
    public async getLeaderboard(): Promise<LeaderboardEntryDTO[]> {
        const leaderboard = await leaderboardService.getLeaderboard();
        return leaderboard;
    }

    @Get("/history/me")
    @Security("jwt", [])
    public async getUserGame(@Request() req: ExpressRequest) {
        const games = await leaderboardService.getUserGames(req.user.id);
        return games;
    }

    @Get("/history/{userId}")
    public async getLeaderboardUser(@Request() req: ExpressRequest, @Path() userId: number) {
        const games = await leaderboardService.getLeaderboardUser(userId);
        return games;
    }

}