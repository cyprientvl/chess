import { LeaderboardDTO, } from "../dto/leaderboard.dto";
import { Game, GameAttributes } from "../models/game.model";
import { User } from "../models/user.model";
import { Op, WhereOptions } from "sequelize";

export class LeaderboardService {
    public async getLeaderboard(): Promise<LeaderboardDTO | null> {
        const users = await User.findAll();

        const whereClause: WhereOptions<GameAttributes> = {
            owner_win: true,
        };


        // Obtenir tous les jeux avec leurs gagnants
        const games = await Game.findAll({
            where: whereClause
        });

        // Calculer le nombre de victoires par utilisateur
        const userVictories = new Map<string, number>();

        // Initialiser tous les utilisateurs avec 0 victoires
        users.forEach(user => {
            userVictories.set(user.username, 0);
        });

        // Compter les victoires
        games.forEach(game => {
            if (game.owner_win) {
                const winner = game.owner;
                if (winner) {
                    userVictories.set(winner.username, userVictories.get(winner.username)! + 1);
                }
            }
        });

        // Créer la liste triée
        const sortedEntries = Array.from(userVictories.entries())
            .sort(([, a], [, b]) => b - a)
            .map(([username, score], index) => ({
                username,
                score,
                rank: index + 1
            }));

        return {
            list: sortedEntries
        };
    }

}

export const leaderboardService = new LeaderboardService();
