import React from "react";
import { Loader } from "@vibe/core";
import { useKonnectify } from "../../hooks";
import { PageLayout } from "../common/PageLayout";
import { SetupWizard } from "./SetupWizard";
import styles from "./AccountSettings.module.css";

export const AccountSettings: React.FC = () => {
  const { loading } = useKonnectify();

  if (loading) {
    return (
      <PageLayout title="Account Settings" subtitle="Loading your account information">
        <div className={styles.loaderContainer}>
          <Loader size="large" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Account Settings" subtitle="Manage your Konnectify workspace">
      <div className={styles.container}>
        <SetupWizard />
      </div>
    </PageLayout>
  );
};
