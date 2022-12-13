export function webhookUrlToIdAndToken(url: string): { id: string, token: string }
{
  // https://discord.com/api/webhooks/312313daw/dawd12313dwdad
  // Take as reference the above url
  // Split the url by '/'
  // The last part is the token
  // The second to last part is the id
  const urlParts = url.split('/');
  const id = urlParts[urlParts.length - 2];
  const token = urlParts[urlParts.length - 1];
  return { id, token };
}