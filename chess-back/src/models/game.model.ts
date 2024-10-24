import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données
import { User } from "./user.model";
import { Color } from "../enums/color.enum";

export interface GameAttributes {
  id?: number;
  owner?: User;
  isPublic: boolean;
  winner?: User;
  owner_id: number;
  winner_id: number;
  creationDate: string;
  dateEnd: string;
  ownerColor: Color
}

export class Game
  extends Model<GameAttributes>
  implements GameAttributes {
  public id!: number;
  public owner!: User;
  public owner_id!: number;
  public isPublic!: boolean;
  public winner!: User;
  public creationDate!: string;
  public dateEnd!: string;
  public ownerColor!: Color
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
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    creationDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateEnd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ownerColor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "User",
  }
);

