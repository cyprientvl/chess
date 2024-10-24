import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  define: {
    timestamps: false,
  },
  storage: "./chess.sqlite", // Chemin vers la base SQLite
});

export default sequelize;