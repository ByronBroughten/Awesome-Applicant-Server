import { Server } from "http";
import request from "supertest";
import { Applicant, ApplicantService } from "../App/ApplicantService";
import { runApp } from "../runApp";

describe("/applicant/create", () => {
  const fullName = "Applicant Create Test";
  let server: Server;
  let applicantService: ApplicantService;
  beforeEach(async () => {
    server = await runApp({ setDefaultDb: false });
    applicantService = await ApplicantService.init();
    await applicantService.delete(fullName);
  });
  afterEach(() => {
    server.close();
  });
  it("should return status 200 and create an applicant", async () => {
    const body: Applicant = {
      fullName,
      skill: "Testing",
      hobby: "Juggling",
    };
    const res = await request(server).post("/applicant/create").send(body);

    expect(res.status).toBe(200);
    expect(await applicantService.last()).toEqual(body);
  });
  it("should return status 500 and not create an applicant", async () => {
    const body: Omit<Applicant, "hobby"> = {
      fullName,
      skill: "Testing",
    };

    const res = await request(server).post("/applicant/create").send(body);

    expect(res.status).toBe(500);
    expect(await applicantService.has(body.fullName)).toBe(false);
  });
});
