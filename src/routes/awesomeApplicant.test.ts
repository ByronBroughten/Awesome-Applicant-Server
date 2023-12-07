import { Server } from "http";
import request from "supertest";
import { ApplicantService, byronProps } from "../App/ApplicantService";
import { runApp } from "../runApp";

describe("/awesome/applicant", () => {
  let server: Server;
  let applicantService: ApplicantService;
  beforeEach(async () => {
    server = await runApp({ setDefaultDb: false });
    applicantService = await ApplicantService.init();
    await applicantService.delete(byronProps.fullName, true);
    await applicantService.create(byronProps);
  });
  afterEach(() => {
    server.close();
  });
  it("should return status 200 and the Byron applicant", async () => {
    const { status, text } = await request(server).get("/awesome/applicant");
    const data = JSON.parse(text);

    expect(status).toBe(200);
    expect(data).toEqual(byronProps);
  });
});
