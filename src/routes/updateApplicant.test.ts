import { Server } from "http";
import request from "supertest";
import { Applicant, ApplicantService } from "../App/ApplicantService";
import { runApp } from "../runApp";

describe("/applicant/update", () => {
  const fullName = "Applicant Update Test";
  const unUpdatedBody = {
    fullName,
    skill: "un-updated skill",
    hobby: "un-updated hobby",
  };
  let server: Server;
  let applicantService: ApplicantService;
  beforeEach(async () => {
    server = await runApp({ setDefaultDb: false });
    applicantService = await ApplicantService.init();
    await applicantService.delete(fullName);
    await applicantService.create(unUpdatedBody);
  });
  afterEach(() => {
    server.close();
  });
  it("should return status 200 and update the applicant", async () => {
    const updatedBody: Applicant = {
      fullName,
      skill: "updated skill",
      hobby: "updated hobby",
    };
    const res = await request(server)
      .post("/applicant/update")
      .send(updatedBody);

    expect(res.status).toBe(200);
    const applicant = await applicantService.get(fullName);
    expect(applicant).toEqual(updatedBody);
  });
  it("should return status 400 and not update the applicant", async () => {
    const invalidBody: Omit<Applicant, "skill"> = {
      fullName,
      hobby: "updated hobby",
    };
    const res = await request(server)
      .post("/applicant/update")
      .send(invalidBody);

    expect(res.status).toBe(400);
    const applicant = await applicantService.get(fullName);
    expect(applicant).toEqual(unUpdatedBody);
  });
});
