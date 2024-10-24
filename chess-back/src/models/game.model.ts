import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données
import { User } from "./user.model";
import { Color } from "../enums/color.enum";
import { GameAction } from "./gameAction.model";

export interface GameAttributes {
  id?: number;
  owner?: User;
  public: boolean;
  winner?: User;
  owner_id: number;
  winner_id?: number;
  creation_date: number;
  date_end?: number;
  owner_color: Color
}

export class Game
  extends Model<GameAttributes>
  implements GameAttributes {
  public id!: number;
  public owner!: User;
  public owner_id!: number;
  public public!: boolean;
  public winner!: User;
  public creation_date!: number;
  public date_end!: number;
  public owner_color!: Color
  public winner_id!: number;
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
    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    creation_date: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_end: {
      type: DataTypes.INTEGER,
      allowNull: false,
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


