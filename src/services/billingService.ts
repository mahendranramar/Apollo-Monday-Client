import { KonnectifyClient } from "./konnectifyClient";
import { storageService } from "./storageService";
import type {
  BillingInfo,
  SubscriptionInfo,
} from "../types";

export class BillingService {
  constructor(private storage = storageService) {}

  async fetchBilling(client: KonnectifyClient): Promise<BillingInfo> {
    try {
      const billing = await client.getBillingInfo();

      const subscription: SubscriptionInfo = {
        plan: billing.plan,
        status: billing.status,
        renewalDate: billing.renewalDate,
        billingCycle: billing.cycle,
        inTrial: billing.inTrial,
      };
      await this.storage.setSubscriptionInfo(subscription);

      return billing;
    } catch (error) {
      client.handleError("getBillingInfo", error);
    }
  }

}

export const billingService = new BillingService();
