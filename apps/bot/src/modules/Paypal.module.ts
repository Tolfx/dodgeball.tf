import paypal from "paypal-rest-sdk";
import {
  API_DOMAIN,
  IS_PROD,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET
} from "../util/constants";
import Logger from "@dodgeball/logger";
import { DonatorUser, DonatorUserModel } from "@dodgeball/mongodb";
import SteamID from "steamid";

const log = new Logger("dodgeball:bot:modules:Paypal.module");

export default class PaypalModule {
  private client: typeof paypal;
  public isReady = false;

  constructor() {
    this.client = paypal;
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      log.error("Paypal client id or secret is not set");
      return;
    }
    if (!IS_PROD) {
      log.warn("Paypal is not enabled in dev mode");
      return;
    }
    this.client.configure({
      mode: !IS_PROD ? "sandbox" : "live",
      client_id: PAYPAL_CLIENT_ID,
      client_secret: PAYPAL_CLIENT_SECRET
    });
    this.isReady = true;
  }

  getClient() {
    return this.client;
  }

  async createPayment(
    amount: number,
    steamid: string,
    description = "Supporter",
    currency = "USD"
  ) {
    return new Promise<string | undefined>((resolve, reject) => {
      this.client.payment.create(
        {
          intent: "sale",
          payer: {
            payment_method: "paypal"
          },
          redirect_urls: {
            return_url: `${API_DOMAIN}/donator/paypal/success`,
            cancel_url: `${API_DOMAIN}/donator/paypal/cancel`
          },
          transactions: [
            {
              amount: {
                total: amount.toString(),
                currency
              },
              description,
              reference_id: steamid
            }
          ]
        },
        (err, payment) => {
          if (err) {
            log.error(err);
            return reject(err);
          }
          resolve(
            payment?.links?.find((link) => link.rel === "approval_url")?.href
          );
        }
      );
    });
  }

  async executePayment(
    paymentId: string,
    payerId: string
  ): Promise<{
    donator: DonatorUser;
    payment: paypal.Payment;
  }> {
    return new Promise((resolve, reject) => {
      this.client.payment.execute(
        paymentId,
        {
          payer_id: payerId
        },
        async (err, payment) => {
          if (err) {
            log.error(err);
            return reject(err);
          }

          // Go through the transactions and find the one with the reference id
          const transaction = payment?.transactions?.find(
            (transaction) => transaction.reference_id
          );
          if (!transaction) {
            // Major issue
            log.error("No transaction found");
            return reject("No transaction found");
          }

          // We found our transaction, lets get steamid and check if we a donator
          const steamid = transaction.reference_id;
          if (!steamid) {
            log.error("No steamid found");
            return reject("No steamid found");
          }
          const donator = await DonatorUserModel.findOne({
            steamId: new SteamID(steamid).getSteamID64()
          });

          if (!donator) {
            log.error("No donator found for steamid: ", steamid);
            return reject("No donator found");
          }

          // We found our donator, lets update the donator
          // Lets return him
          resolve({
            donator,
            payment
          });
        }
      );
    });
  }
}
