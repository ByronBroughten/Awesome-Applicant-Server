import { NextFunction, Request, Response } from "express";

interface ResStatusErrorProps {
  message: string;
  status: number;
}

export class ResStatusError extends Error {
  readonly message: string;
  readonly status: number;
  constructor({ message, status }: ResStatusErrorProps) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

export function handleErrors(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err.message, err);
  if (err instanceof ResStatusError) {
    const { message, status } = err;
    res.status(status).send(message);
  } else {
    res.status(500).send("Something went wrong.");
  }
  next();
}

export function validateString(value: any): string {
  if (typeof value === "string") {
    return value;
  } else {
    throw new ResStatusError({
      message: `value ${value} is not a string`,
      status: 400,
    });
  }
}
