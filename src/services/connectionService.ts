import { KonnectifyClient } from "./konnectifyClient";
import { storageService } from "./storageService";
import type { Connection } from "../types";

export class ConnectionService {
  constructor(private storage = storageService) {}

  async list(client: KonnectifyClient): Promise<Connection[]> {
    try {
      const connections = await client.listConnections();
      await this.storage.setConnections(connections);
      return connections;
    } catch (error) {
      client.handleError("listConnections", error);
    }
  }

  async create(
    client: KonnectifyClient,
    appId: string,
    name: string,
    data: Record<string, unknown> = {},
  ): Promise<Connection> {
    try {
      const connection = await client.createConnection(appId, name, data);
      const connections = await this.list(client);
      void connections;
      return connection;
    } catch (error) {
      client.handleError("createConnection", error);
    }
  }

  async edit(
    client: KonnectifyClient,
    connectionId: string,
    appId: string,
    name: string,
    data: Record<string, unknown> = {},
  ): Promise<Connection> {
    try {
      const connection = await client.editConnection(
        connectionId,
        appId,
        name,
        data,
      );
      await this.list(client);
      return connection;
    } catch (error) {
      client.handleError("editConnection", error);
    }
  }

  async delete(client: KonnectifyClient, connectionId: string): Promise<void> {
    try {
      await client.deleteConnection(connectionId);
      await this.list(client);
    } catch (error) {
      client.handleError("deleteConnection", error);
    }
  }

  async getOAuthUrl(
    client: KonnectifyClient,
    appId: string,
    connectionName: string,
    isEditing?: boolean,
    connectionId?: string
  ): Promise<{authUrl:string}> {
    try {
      const authUrlResponse = await client.getOAuthAuthUrl(appId, connectionName, isEditing, connectionId);
      return authUrlResponse
    } catch (error) {
      client.handleError("getOAuthAuthUrl", error);
    }
  }

  async getCached(): Promise<Connection[]> {
    return this.storage.getConnections();
  }

}

export const connectionService = new ConnectionService();
