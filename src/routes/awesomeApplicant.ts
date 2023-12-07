import { App } from "../App";

export function useAwesomeApplicant({ router, applicantService }: App): void {
  router.get("/awesome/applicant", async (_, res, next) => {
    try {
      const applicant = await applicantService.getByron();
      res.send(applicant);
    } catch (error) {
      next(error);
    }
  });
}
