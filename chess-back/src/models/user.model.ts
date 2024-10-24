import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données
import { Game } from "./game.model";

export interface UserAttributes {
  id?: number;
  username: string;
  password: string;
  role: string;
}

export class User
  extends Model<UserAttributes>
  implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "User",
  }
);


User.hasMany(Game, { foreignKey: "owner_id", as: "game_owner" });
Game.belongsTo(User, { foreignKey: "owner_id", as: "owner" });
