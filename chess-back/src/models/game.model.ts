import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données
import { User } from "./user.model";
import { Color } from "../enums/color.enum";
import { GameAction } from "./gameAction.model";

export interface GameAttributes {
  id?: number;
  owner?: User;
  public: boolean;
  owner_id: number;
  owner_win?: number;
  creation_date: number;
  date_end?: number;
  owner_color: Color;
  gameAction?: GameAction[];
}

export class Game
  extends Model<GameAttributes>
  implements GameAttributes {
  public id!: number;
  public owner!: User;
  public owner_id!: number;
  public public!: boolean;
  public creation_date!: number;
  public date_end!: number;
  public owner_color!: Color
  public owner_win!: number;
  public gameAction?: GameAction[];
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    owner_win: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    creation_date: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_end: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    owner_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Game",
  }
);

