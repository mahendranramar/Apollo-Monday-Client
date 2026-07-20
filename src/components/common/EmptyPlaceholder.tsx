import React from "react";
import { AttentionBox, Text } from "@vibe/core";

interface EmptyPlaceholderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <AttentionBox title={title} type="neutral">
      <Text type="text2">{description}</Text>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </AttentionBox>
  );
};
