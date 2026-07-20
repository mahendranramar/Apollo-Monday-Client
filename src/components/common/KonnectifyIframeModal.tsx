import React, { useEffect, useState } from "react";
import { Loader, Modal, ModalBasicLayout, ModalContent, ModalHeader } from "@vibe/core";
import styles from "./KonnectifyIframeModal.module.css";

interface KonnectifyIframeModalProps {
  id: string;
  show: boolean;
  title: string;
  url: string | null;
  loading?: boolean;
  onClose: () => void;
}

export const KonnectifyIframeModal: React.FC<KonnectifyIframeModalProps> = ({
  id,
  show,
  title,
  url,
  loading = false,
  onClose,
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    if (show && url) {
      setIframeLoading(true);
    }
  }, [show, url]);

  return (
    <Modal id={id} show={show} onClose={onClose} size="full-view">
      <ModalBasicLayout>
        <ModalHeader title={title} />
        <ModalContent>
          <div className={styles.frameWrapper}>
            {(loading || iframeLoading) && (
              <div className={styles.loaderOverlay}>
                <Loader size="medium" />
              </div>
            )}
            {url && (
              <iframe
                title={title}
                src={url}
                className={styles.iframe}
                onLoad={() => setIframeLoading(false)}
              />
            )}
          </div>
        </ModalContent>
      </ModalBasicLayout>
    </Modal>
  );
};
