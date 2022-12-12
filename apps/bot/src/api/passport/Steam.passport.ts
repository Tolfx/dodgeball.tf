import { DonatorUserModel } from '@dodgeball/mongodb';
import SteamStrategy from 'passport-steam';
import { API_DOMAIN, STEAM_API_KEY } from '../../util/constants';

// @ts-ignore
export default new SteamStrategy({
  returnURL: `${API_DOMAIN}/donator/auth/steam/callback`,
  realm: API_DOMAIN,
  apiKey: STEAM_API_KEY
},
  // @ts-ignore
  async function (identifier, profile, done)
  {
    // Will use this for donators for now?
    const user = await DonatorUserModel.findOne({
      steamId: profile.id
    });

    if (!user)
    {
      // Create new user
      const newUser = await (new DonatorUserModel({
        steamId: profile.id,
        steamName: profile.displayName
      }).save());

      const newUserData = Object.assign(newUser.toJSON(), { identifier });
      return done(null, newUserData);
    }

    const newUserData = Object.assign(user.toJSON(), { identifier });
    return done(null, newUserData);
  }
)