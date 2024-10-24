import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données
import { User } from "./user.model";
import { Color } from "../enums/color.enum";

export interface GameAttributes {
  id?: number;
  owner?: User;
  public: boolean;
  winner?: User;
  owner_id: number;
  winner_id: number;
  creation_date: string;
  date_end: string;
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
  public creation_date!: string;
  public date_end!: string;
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
      allowNull: false,
    },
    creation_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_end: {
      type: DataTypes.STRING,
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

