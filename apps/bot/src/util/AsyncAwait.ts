/**
 *
 * @param method {Promise<T>} The method to await
 * @returns [data, error]
 */
export default async function AsyncAwait<T>(
  method: Promise<T>
): Promise<[T | null, null | Error]> {
  try {
    const data = await method;
    return [data, null];
  } catch (error) {
    const isError = error instanceof Error;
    if (!isError) {
      return [null, new Error(String(error))];
    }
    return [null, error];
  }
}
