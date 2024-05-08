import dotenv from "dotenv";
dotenv.config();

interface Config {
  JWT_SECRET?: string;
  DATABASE_URI?: string;
  NODE_ENV: string;
  APP_PORT: number;
  APP_ORIGINS: string[];
}

const config: Config = {
  DATABASE_URI: process.env.DATABASE_URI || "mongodb://localhost:27017/todo",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET:process.env.JWT_SECRET,
  APP_PORT: parseInt(process.env.APP_PORT) || 4000,
  APP_ORIGINS: process.env.APP_ORIGINS?.split(",") || ["http://localhost:4000","https://studio.apollographql.com"],
};

export default config;