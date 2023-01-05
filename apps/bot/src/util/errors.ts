export function isError(error: any): error is Error {
  return error instanceof Error;
}
