import express from "express";
import { Server } from "http";
import { App } from "./App";
import { handleErrors } from "./handleErrors";
import { useAwesomeApplicant } from "./routes/awesomeApplicant";
import { useCreateApplicant } from "./routes/createApplicant";
import { useDeleteApplicant } from "./routes/deleteApplicant";
import { useUpdateApplicant } from "./routes/updateApplicant";

type Props = { setDefaultDb?: boolean };
export async function runApp({
  setDefaultDb = true,
}: Props = {}): Promise<Server> {
  const portNumber = process.env.APP_PORT;
  const app = await App.init({ setDefaultDb });
  app.router.use(express.urlencoded({ extended: true }));
  app.router.use(express.json());
  useAwesomeApplicant(app);
  useCreateApplicant(app);
  useUpdateApplicant(app);
  useDeleteApplicant(app);
  app.router.use(handleErrors);

  return app.router.listen(portNumber, () => {
    console.log("Server online.");
  });
}
