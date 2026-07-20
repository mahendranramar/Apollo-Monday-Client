import { storageService } from "./storageService";
import type { SetupProgress, Tenant } from "../types";

export class TenantService {
  constructor(private storage = storageService) {}

  async getTenant(): Promise<Tenant | null> {
    // storing all the values which are filled during resgisteration
    return this.storage.getTenant();
  }

  async isConfigured(): Promise<boolean> {
    return this.storage.isConfigured();
  }

  async getSetupProgress(): Promise<SetupProgress> {
    // storing completed steps in config page
    return this.storage.getSetupProgress();
  }

  async updateSetupProgress(progress: Partial<SetupProgress>): Promise<SetupProgress> {
    // storing completed steps in config page
    const current = await this.storage.getSetupProgress();
    const updated = { ...current, ...progress };
    await this.storage.setSetupProgress(updated);
    return updated;
  }

  async markStepComplete(step: number): Promise<SetupProgress> {
    const current = await this.storage.getSetupProgress();
    const completedSteps = Array.from(new Set([...current.completedSteps, step]));
    const updated: SetupProgress = {
      ...current,
      completedSteps,
      currentStep: Math.max(current.currentStep, step + 1),
    };
    await this.storage.setSetupProgress(updated);
    return updated;
  }

  getSetupCompletionPercent(progress: SetupProgress): number {
    const totalSteps = 5;
    return Math.round((progress.completedSteps.length / totalSteps) * 100);
  }
}

export const tenantService = new TenantService();
