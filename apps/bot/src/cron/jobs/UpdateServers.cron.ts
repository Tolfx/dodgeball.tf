import Logger from "@dodgeball/logger";
import { CronJob } from "cron";
import Services from "../../services/Services";
import GetAdmins, { AdminSourcebans } from "../../mysql/queries/GetAdmins";
import GetSBServers from "../../mysql/queries/GetSBServers";
import GetSBGroups, { SourcebansGroups } from "../../mysql/queries/GetSBGroups";
import GetSBAdminsServerGroups from "../../mysql/queries/GetSBAdminsServerGroups";
import AddSBAdminsServerGroups from "../../mysql/queries/AddSBAdminsServerGroups";
import AsyncAwait from "../../util/AsyncAwait";
import GetCCCM from "../../mysql/queries/GetCCCM";
import { DonatorUserModel } from "@dodgeball/mongodb";
import SteamID from "steamid";
import { getDonatorCCC } from "../../mysql/queries/AddCCCM";

const LOG = new Logger("dodgeball:bot:cron:jobs:UpdateServersCron");

export default class UpdateServersCron {
  constructor(private services: Services) {
    // Every day at 01:00 in midnight
    // in Europe/Stockholm
    new CronJob(
      "0 1 * * *",
      () => {
        LOG.info(`Running cron job`);
        this.run();
      },
      null,
      true,
      "Europe/Stockholm"
    );
  }

  public async run() {
    // We want to update all of our servers to ensure every admin is in the admin group
    // And got permission on every server

    // We will do so by fetching all admins from our database in sourcebans.sb_admins
    // Then we will fetch all servers from our database in sourcebans.sb_servers and check if they
    // have a row in sourcebans.sb_admins_servers_groups by checking the server_id and admin_id

    // If they don't have a row, we will create one for that server and admin
    // We also need to fetch all the groups with their ids from sourcebans.sb_srvgroups and get their id
    const mysqlConnection = this.services.getMysqlConnection();
    const admins = await GetAdmins(true)(mysqlConnection);

    // Lets remove admin with id 0 because is console
    admins.splice(
      admins.findIndex((admin) => admin.aid === 0),
      1
    );

    // We need to get all servers
    const servers = await GetSBServers()(mysqlConnection);

    // We need to get all groups
    const groups = await GetSBGroups()(mysqlConnection);

    // Lets make a map of all admins, so we can easily get their group id
    const adminsMap = new Map<number, AdminSourcebans & SourcebansGroups>();
    admins.forEach((admin) => {
      const group = groups.find((group) => group.name === admin.srv_group);
      if (!group) return;
      adminsMap.set(admin.aid, {
        ...admin,
        ...group
      });
    });

    const serverPermissions = await GetSBAdminsServerGroups()(mysqlConnection);

    const exceptions: Array<{ adminId: number; serverId: number }> = [];

    // Lets for sanity do a list with the exceptions what we except to be in the database
    admins.forEach((admin) => {
      servers.forEach((server) => {
        exceptions.push({
          adminId: admin.aid,
          serverId: server.sid
        });
      });
    });

    const missingPermissions: Array<{
      adminId: number;
      serverId: number;
      groupId: number;
    }> = [];

    // Lets check if we have all the permissions we expect to have
    exceptions.forEach((exception) => {
      const found = serverPermissions.find((permission) => {
        return (
          permission.admin_id === exception.adminId &&
          permission.server_id === exception.serverId
        );
      });

      if (!found) {
        LOG.warn(
          `Missing permission for admin ${exception.adminId} on server ${exception.serverId}`
        );
        missingPermissions.push({
          adminId: exception.adminId,
          serverId: exception.serverId,
          groupId: adminsMap.get(exception.adminId)?.gid || 0
        });
      }
    });

    // Lets insert all the missing permissions
    missingPermissions.forEach(async (permission) => {
      const [_, failed] = await AsyncAwait(
        AddSBAdminsServerGroups({
          admin_id: permission.adminId,
          group_id: permission.groupId,
          server_id: permission.serverId,
          srv_group_id: -1
        })(mysqlConnection)
      );

      if (failed) {
        LOG.error(
          `Failed to add permission for admin ${permission.adminId} on server ${permission.serverId}`
        );
      } else {
        LOG.warn(
          `Added permission for admin ${permission.adminId} on server ${permission.serverId}`
        );
      }
    });

    // While got all admins too, we can add them to the CCCM
    const allCCCM = await GetCCCM()(mysqlConnection);
    // Check which admins are not in the CCCM
    const missingCCCM = admins.filter(
      (admin) => !allCCCM.find((cccm) => cccm.auth === admin.authid)
    );
    // Add them to the CCCM
    missingCCCM.forEach(async (admin) => {
      // Lets check this admin, to give correct permissions
      // Lets check if also is a donator
      const donator = await DonatorUserModel.findOne({
        steamId: new SteamID(admin.authid).getSteamID64()
      });

      if (donator) {
        const cccDonator = getDonatorCCC(donator);
        const [_, failed] = await AsyncAwait(
          Promise.resolve(
            mysqlConnection.query(
              // eslint-disable-next-line max-len
              `INSERT INTO cccm.cccm_users (auth, hidetag, tagcolor, namecolor, chatcolor, tag) VALUES ('${admin.authid}', 0, '${cccDonator.tagcolor}', '', '', '${cccDonator.tag}');`,
              (error) => {
                if (error) throw error;
                LOG.info(`Added ${admin.user} to the CCCM`);
                return true;
              }
            )
          )
        );

        if (failed) {
          LOG.error(`Failed to add ${admin.user} to the CCCM`);
        }
      } else {
        const [_, failed] = await AsyncAwait(
          Promise.resolve(
            mysqlConnection.query(
              `INSERT INTO cccm.cccm_users (auth, hidetag, tagcolor, namecolor, chatcolor, tag) VALUES ('${admin.authid}', 0, '', '', '', '');`,
              (error) => {
                if (error) throw error;
                LOG.info(`Added ${admin.user} to the CCCM`);
                return true;
              }
            )
          )
        );

        if (failed) {
          LOG.error(`Failed to add ${admin.user} to the CCCM`);
        }
      }
    });
  }
}
