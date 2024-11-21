import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import cors from "cors";  // Ajout de l'import cors

import { RegisterRoutes } from "./routes/index";
import errorHandler from "./middlewares/errorHandler";

const PORT = process.env.PORT || 3000;

const app: Application = express();

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number
      };
    }
  }
}

// Configuration des CORS
app.use(cors({
  origin: 'http://localhost:5173', // L'origine de votre application Vue
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

RegisterRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});