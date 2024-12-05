import { GameDTO } from "../dto/game.dto";
import { LeaderboardEntryDTO } from "../dto/leaderboard.dto";
import { Game, GameAttributes } from "../models/game.model";
import { User } from "../models/user.model";
import { Op, WhereOptions } from "sequelize";

export class LeaderboardService {
    public async getLeaderboard(): Promise<LeaderboardEntryDTO[]> {
        const users = await User.findAll();

        const whereClause: WhereOptions<GameAttributes> = {
            owner_win: {
                [Op.ne]: undefined,
            },
        };

        const games = await Game.findAll({
            where: whereClause
        });

        const userVictories = new Map<string, number>();

        users.forEach(user => {
            userVictories.set(user.username, 0);
        });

        games.forEach(game => {
            if (game.owner_win) {
                const winner = game.owner;
                if (winner) {
                    userVictories.set(winner.username, userVictories.get(winner.username)! + 1);
                }
            }
        });

        const sortedEntries: LeaderboardEntryDTO[]  = Array.from(userVictories.entries())
            .sort(([, a], [, b]) => b - a)
            .map(([username, score], index) => ({
                username,
                score,
                rank: index + 1,
                userId: users[index].id
            }));

        return sortedEntries
    }

    public async getUserGames(userId: number): Promise<GameDTO[]>{
        const game = await Game.findAll({where: { owner_id: userId }});
        return game;
    }

    public async getLeaderboardUser(userId: number){
        const game = await Game.findAll({where: { owner_id: userId, public: true }, 
            include: [{ model: User, as: 'user' }]}
        );
        return game;
    }

}

export const leaderboardService = new LeaderboardService();
