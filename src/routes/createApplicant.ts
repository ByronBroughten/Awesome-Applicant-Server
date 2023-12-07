import { App } from "../App";
import { Applicant } from "../App/ApplicantService";
import { validateString } from "../handleErrors";

export function useCreateApplicant({ router, applicantService }: App): void {
  router.post("/applicant/create", async (req, res, next) => {
    try {
      const props = validateBody(req.body);
      const applicant = await applicantService.create(props);
      res.send(applicant);
    } catch (error) {
      return next(error);
    }
  });
}

function validateBody(body: any): Applicant {
  return {
    fullName: validateString(body.fullName),
    skill: validateString(body.skill),
    hobby: validateString(body.hobby),
  };
}
