import { Application, Response, Request } from "express";
import Services from "../../../services/Services";
import { API_DOMAIN, DISCORD_BOT_ID, DISCORD_CLIENT_SECRET, DISCORD_GUILD_ID, STEAM_API_KEY } from "../../../util/constants";
import type { ControllerRouter } from "../register.router";
import fetch from "node-fetch";
import AsyncAwait from "../../../util/AsyncAwait";
import { isError } from "../../../util/errors";
import { LinkedAccountModel } from "@dodgeball/mongodb";
// @ts-ignore
import SteamAuth from "node-steam-openid";
import debug from "debug";
import { Client } from "discord.js";
import ErrorTemplate from "../../templates/Error.template";
import SuccessTemplate from "../../templates/Success.template";

const LOG = debug('dodgeball:bot:api:routes:Oauth2:Oauth2.controller')

declare module 'express-session' {
  interface SessionData
  {
    discord_token?: string;
    steam_id?: string;
  }
}

async function resolveDiscordToken(code: string)
{
  const userReq = await fetch("https://discord.com/api/users/@me", {
    headers: {
      "Authorization": `Bearer ${code}`
    }
  });

  const user = await userReq.json() as any;

  if (!user.id)
  {
    //@ts-ignore
    return null;
  }

  return {
    id: user.id as string,
  }
}

const steamAuth = new SteamAuth({
  realm: API_DOMAIN,
  returnUrl: `${API_DOMAIN}/oauth2/steam/callback`,
  apiKey: STEAM_API_KEY
});

export default class Oauth2Controller implements ControllerRouter
{
  public server: Application;
  public services: Services;
  private client: Client;

  constructor(server: Application, services: Services)
  {
    this.server = server;
    this.services = services;
    this.client = this.services.getDiscordClient();
  }

  public async linkAccounts(req: Request, res: Response)
  {
    if (!req.session.discord_token)
      return res.redirect("/oauth2/discord");

    const discordToken = req.session.discord_token;

    const discordInfo = await resolveDiscordToken(discordToken);

    if (!discordInfo)
    {
      LOG('Error resolving discord token')
      return res.status(500).send(ErrorTemplate(`Error resolving discord token`));
    }

    const linkedAccount = await LinkedAccountModel.findOne({
      discordId: discordInfo.id
    });

    if (linkedAccount)
      return res.status(500).send(ErrorTemplate(`This discord account is already linked to another steam account.`));

    if (!req.session.steam_id)
      return res.redirect("/oauth2/steam");

    const steamId = req.session.steam_id;

    const linkedAccount2 = await LinkedAccountModel.findOne({
      steamId: steamId
    });

    if (linkedAccount2)
      return res.status(500).send(ErrorTemplate(`This steam account is already linked to another discord account.`));

    const newLinkedAccount = new LinkedAccountModel({
      discordId: discordInfo.id,
      steamId: steamId
    });

    await newLinkedAccount.save();

    (this.client?.guilds.cache.get(DISCORD_GUILD_ID))?.members.add(await this.client.users?.fetch(discordInfo.id), {
      accessToken: req?.session.discord_token ?? "",
    }).then((user: any) => LOG(`Added user ${user.user.username} to the server`)).catch((e: Error) => LOG(`Error adding user to the server: ${e}`));

    return res.send(SuccessTemplate(`Successfully linked your discord and steam accounts.`));
  }

  public async steam(req: Request, res: Response)
  {
    return res.redirect(await steamAuth.getRedirectUrl());
  }

  public async steamCallback(req: Request, res: Response)
  {
    const [steamuser, eSteamuser] = await AsyncAwait<any>(steamAuth.authenticate(req));
    if (!steamuser)
    {
      LOG('Error authenticating steam user, eror: ', eSteamuser);
      return res.status(500).send(ErrorTemplate(`Error authenticating steam user`));
    }

    if (eSteamuser)
    {
      LOG('Error authenticating steam user, error: ', eSteamuser);
      return res.status(500).send(ErrorTemplate(`Error authenticating steam user`));
    }

    if (isError(steamuser))
    {
      LOG('Error authenticating steam user');
      return res.status(500).send(ErrorTemplate(`Error authenticating steam user`));
    }

    const steamId = steamuser.steamid;

    req.session.steam_id = steamId;

    return res.redirect('/oauth2/link');
  }

  public discord(req: Request, res: Response)
  {
    const callbackUrl = `${API_DOMAIN}/oauth2/discord/callback`;
    const discordUri = `https://discord.com/oauth2/authorize?client_id=${DISCORD_BOT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=${encodeURIComponent("identify guilds.join")}`;

    return res.redirect(discordUri);
  }

  public async discordCallback(req: Request, res: Response)
  {
    const [auth, eAuth] = await AsyncAwait(fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: DISCORD_BOT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.query.code as string,
        redirect_uri: `${API_DOMAIN}/oauth2/discord/callback`,
        scope: "identify guilds.join"
      })
    }))

    if (eAuth)
    {
      LOG(`Unknown error from discord: `, eAuth);
      return res.status(500).send(ErrorTemplate(`Unknown error from discord`));
    }

    if (!auth || isError(auth))
    {
      LOG(`Got an error from auth: `, auth);
      return res.status(500).send(ErrorTemplate(`Got an error from auth`));
    }

    const authJson = await auth.json() as any;

    const token = authJson['access_token'];

    if (!token)
    {
      LOG('Failed to get token from discord');
      return res.status(500).send(ErrorTemplate(`Failed to get token from discord`));
    }

    req.session.discord_token = token;

    return res.redirect('/oauth2/link');
  }
}