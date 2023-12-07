import { Sequelize } from "sequelize";

export async function initSequelize() {
  const databaseName = process.env.POSTGRES_DB as string;
  const host = process.env.POSTGRES_HOST as string;
  const port = process.env.POSTGRES_PORT as unknown as number;
  const username = process.env.POSTGRES_USERNAME as string;
  const password = process.env.POSTGRES_PASSWORD as string;
  const sequelize = new Sequelize(
    `postgres://postgres:postgres@localhost/${databaseName}`,
    {
      // database,
      host,
      port,
      username,
      password,
      dialect: "postgres",
    }
  );

  try {
    await sequelize.authenticate();
    console.log("Database connected.");
  } catch (error) {
    console.log("Database failed to connect", error);
  }
  return sequelize;
}
