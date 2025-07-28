import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.join(process.cwd(), ".env") });

dotenv.config();

interface IEnvConfig {
  PORT: string;
  DATABASE_URI: string;
  NODE_ENV: "development" | "production";
}

const envVars: IEnvConfig = {
  PORT: process.env.PORT as string,
  DATABASE_URI: process.env.DATABASE_URI as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
};

export default envVars;
