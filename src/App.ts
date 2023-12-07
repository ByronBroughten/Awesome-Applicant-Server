import express, { Express } from "express";
import { ApplicantService } from "./App/ApplicantService";

type InitProps = { setDefaultDb?: boolean };

export class App {
  router: Express;
  applicantService: ApplicantService;
  constructor(applicantService: ApplicantService) {
    this.router = express();
    this.applicantService = applicantService;
  }
  static async init({ setDefaultDb }: InitProps = {}): Promise<App> {
    const applicantService = await ApplicantService.init();
    if (setDefaultDb) {
      await applicantService.setDefault();
    }
    return new App(applicantService);
  }
}
