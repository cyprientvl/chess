import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, Tags } from "tsoa";
import { LeaderboardDTO } from "../dto/leaderboard.dto";
import { leaderboardService } from "../services/leaderboard.service";

@Route("leaderboard")
@Tags("Leaderboard")
export class LeaderboardController extends Controller {

    @Get("/")
    public async getLeaderboard(): Promise<LeaderboardDTO | null> {
        const leaderboard = await leaderboardService.getLeaderboard();

        return leaderboard;
    }

}