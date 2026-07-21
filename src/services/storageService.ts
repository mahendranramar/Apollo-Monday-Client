import mondaySdk from "monday-sdk-js";
import type {
  AuthState,
  Connection,
  SetupProgress,
  SubscriptionInfo,
  Tenant,
  WorkflowTemplate,
} from "../types";

const monday = mondaySdk();

const KEYS = {
  tenant: "konnectify_tenant",
  auth: "konnectify_auth",
  bootstrapToken: "konnectify_bootstrap_token",
  sessionPassword: "konnectify_session_pw",
  connections: "konnectify_connections",
  subscription: "konnectify_subscription",
  templates: "konnectify_templates",
  setupProgress: "konnectify_setup_progress",
} as const;


async function get<T>(key: string): Promise<T | null> {
 
  try {
    const res:any = await monday.storage.getItem(key);
    const value = res.data.value;
    if (value) return JSON.parse(value) as T;
  } catch(error) {
    console.log("Error while fetching value from the storage", error);
  }
  return null;
}

async function set<T>(key: string, value: T): Promise<void> {
  const serialized = JSON.stringify(value);
  try {
    await monday.storage.setItem(key, serialized);
  } catch (error) {
    console.log("Error in storing value", error);
  }

}

async function del(key: string): Promise<void> {
  try {
    await monday.storage.deleteItem(key);
  } catch(error) {
    console.log("Error occured while deleting the value from storage", error);
  }
}

// ─── StorageService ────────────────────────────────────────────────────────

export class StorageService {
  async getTenant(): Promise<Tenant | null> {
    return get<Tenant>(KEYS.tenant);
  }
  async setTenant(tenant: Tenant): Promise<void> {
    return set(KEYS.tenant, tenant);
  }

  async getAuth(): Promise<AuthState | null> {
    return get<AuthState>(KEYS.auth);
  }
  async setAuth(auth: AuthState): Promise<void> {
    return set(KEYS.auth, auth);
  }

  async getBootstrapToken(): Promise<string | null> {
    return get<string>(KEYS.bootstrapToken);
  }
  async setBootstrapToken(token: string): Promise<void> {
    return set(KEYS.bootstrapToken, token);
  }

  // Stored so bootstrap tokens can be refreshed after a page reload.
  // Bootstrap tokens expire in 120 s, so we need the credential available
  // at any time without prompting the user again.
  async getSessionPassword(): Promise<string | null> {
    return get<string>(KEYS.sessionPassword);
  }
  async setSessionPassword(password: string): Promise<void> {
    return set(KEYS.sessionPassword, password);
  }

  async getConnections(): Promise<Connection[]> {
    return (await get<Connection[]>(KEYS.connections)) ?? [];
  }
  async setConnections(connections: Connection[]): Promise<void> {
    return set(KEYS.connections, connections);
  }

  async getSubscriptionInfo(): Promise<SubscriptionInfo | null> {
    return get<SubscriptionInfo>(KEYS.subscription);
  }
  async setSubscriptionInfo(subscriptionInfo: SubscriptionInfo): Promise<void> {
    return set(KEYS.subscription, subscriptionInfo);
  }

  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    return (await get<WorkflowTemplate[]>(KEYS.templates)) ?? [];
  }
  async setWorkflowTemplates(templates: WorkflowTemplate[]): Promise<void> {
    return set(KEYS.templates, templates);
  }

  async getSetupProgress(): Promise<SetupProgress> {
    return (
      (await get<SetupProgress>(KEYS.setupProgress)) ?? {
        currentStep: 1,
        completedSteps: [],
        templatesInstalled: false,
      }
    );
  }
  async setSetupProgress(progress: SetupProgress): Promise<void> {
    return set(KEYS.setupProgress, progress);
  }

  /** @deprecated kept for compat */
  async getConnectors(): Promise<Record<string, string>> {
    return {};
  }
  /** @deprecated kept for compat */
  async setConnectors(_connectors: Record<string, string>): Promise<void> {}


  async clear(): Promise<void> {
    await Promise.all(Object.values(KEYS).map((k) => del(k)));
  }

  async isConfigured(): Promise<boolean> {
    const tenant = await this.getTenant();
    const auth = await this.getAuth();
    return !!tenant && !!auth?.accessToken;
  }
}

export const storageService = new StorageService();
