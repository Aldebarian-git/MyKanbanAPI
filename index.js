import "dotenv/config";
import express from "express";
import { router } from "./src/router.js";
import { notFound, errorHandler } from "./src/middlewares/errorHandlers.js";
import { xss } from "express-xss-sanitizer";
import cors from "cors";

const app = express();
app.set("trust proxy", 1);

app.use(express.json());

const allowedOrigins = [
    /^http:\/\/localhost:\d+$/, // Autoriser localhost avec n'importe quel port
    /^http:\/\/127\.0\.0\.1:\d+$/, // Autoriser 127.0.0.1 avec n'importe quel port
    "https://my-kanban-spa.vercel.app", // Autoriser ton SPA hébergée sur Vercel
    "https://my-kanban-react-spa.vercel.app", //Autoriser REACT SPA hébergée sur Vercel
  ];
  
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.some((o) => (typeof o === "string" ? o === origin : o.test(origin)))) {
          callback(null, true); // Autoriser l'origine
        } else {
          callback(new Error("Not allowed by CORS")); // Bloquer l'origine
        }
      },
    })
  );

app.use(xss());

app.use(router);

app.use(notFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.BASE_URL}:${process.env.PORT}`);
});
