import React from "react";
import { Heading, Text } from "@vibe/core";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  actions,
  sidebar,
  children,
}) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div>
          <Heading type="h1" weight="bold">
            {title}
          </Heading>
          {subtitle && (
            <Text type="text2" color="secondary" className={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>

      <div className={sidebar ? styles.bodyWithSidebar : styles.body}>
        {sidebar}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};
