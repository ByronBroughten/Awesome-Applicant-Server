import { App } from "../App";
import { validateString } from "../utils";

export function useDeleteApplicant({ router, applicantService }: App): void {
  router.post("/applicant/delete", async (req, res, next) => {
    try {
      const fullName = validateString(req.body.fullName);
      await applicantService.delete(fullName);
      res.sendStatus(200);
    } catch (error) {
      return next(error);
    }
  });
}
