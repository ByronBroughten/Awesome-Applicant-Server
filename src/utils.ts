export function validateString(value: any): string {
  if (typeof value === "string") {
    return value;
  } else {
    throw new Error(`value ${value} is not a string`);
  }
}
