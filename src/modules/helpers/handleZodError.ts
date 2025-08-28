/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../Interfaces/error.types";

export const handleZodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path,
      message: issue.message,
    });
  });
  return {
    statusCode: 400,
    message: "Zod Error",
    errorSources,
  };
};
