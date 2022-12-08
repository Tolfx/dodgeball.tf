export function steamidToUSteamid(steamid: string)
{
  const steamidSplit = steamid.split(':');
  const usteamid = [];
  usteamid.push('[U:1:');

  const y = parseInt(steamidSplit[1])
  const z = parseInt(steamidSplit[2])

  const steamacct = (z * 2) + y;

  usteamid.push(steamacct + ']');

  return usteamid.join('');
}