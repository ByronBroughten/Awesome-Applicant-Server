import { Server } from "http";
import request from "supertest";
import { ApplicantService } from "../App/ApplicantService";
import { runApp } from "../runApp";

describe("/applicant/delete", () => {
  const fullName = "Applicant Delete Test";
  let server: Server;
  let applicantService: ApplicantService;
  beforeEach(async () => {
    server = await runApp({ setDefaultDb: false });
    applicantService = await ApplicantService.init();
    await applicantService.delete(fullName);
    await applicantService.create({
      fullName,
      skill: "Testing",
      hobby: "Being deleted",
    });
  });
  afterEach(() => {
    server.close();
  });
  it("should return status 200 and delete and applicant", async () => {
    const res = await request(server)
      .post("/applicant/delete")
      .send({ fullName });

    expect(res.status).toBe(200);
    expect(await applicantService.has(fullName)).toBe(false);
  });
  it("should not delete the applicant", async () => {
    await request(server)
      .post("/applicant/delete")
      .send({ fullName: "Nonexistent Full Name" });

    expect(await applicantService.has(fullName)).toBe(true);
  });
});
