import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données
import { Game } from "./game.model";

export interface GameActionAttributes {
    id?: number;
    game_id: number;
    game?: Game;
    from: string;
    to: string;
    piece: string;
    result: string;
}

export class GameAction
    extends Model<GameActionAttributes>
    implements GameActionAttributes {
    public id?: number;
    public game_id!: number;
    public game!: Game;
    public from!: string;
    public to!: string;
    public piece!: string;
    public result!: string;
}

GameAction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        piece: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        result: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "GameAction",
    }
);

Game.hasMany(GameAction, { foreignKey: "game_id", as: "gameAction" });
GameAction.belongsTo(Game, { foreignKey: "game_id", as: "gameAction" });
