import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.join(process.cwd(), ".env") });

dotenv.config();

interface IEnvConfig {
  PORT: string;
  DATABASE_URI: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  BCRYPT_SALT_ROUND: string;
}

const envVars: IEnvConfig = {
  PORT: process.env.PORT as string,
  DATABASE_URI: process.env.DATABASE_URI as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_SECRET as string,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
};

export default envVars;
