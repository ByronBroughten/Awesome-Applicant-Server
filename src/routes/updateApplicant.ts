import { App } from "../App";
import { Applicant } from "../App/ApplicantService";
import { validateString } from "../utils";

export function useUpdateApplicant({ router, applicantService }: App) {
  router.post("/applicant/update", async (req, res, next) => {
    try {
      const { fullName, ...rest } = validateBody(req.body);
      await applicantService.update(fullName, rest);
      res.sendStatus(200);
    } catch (error) {
      next(error);
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
