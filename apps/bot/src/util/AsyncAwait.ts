/**
 * 
 * @param method {Promise<T>} The method to await
 * @returns [data, error]
 */
export default async function AsyncAwait<T>(method: Promise<T>)
{
  return method
    .then((data: T) => [data, null])
    .catch((err: Error) => [null, err]);
}