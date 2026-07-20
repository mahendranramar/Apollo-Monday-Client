import React, { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Toast } from "@vibe/core";

type ToastType = "positive" | "negative" | "warning" | "normal";

interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    type: "normal",
  });

  const showToast = useCallback((message: string, type: ToastType = "normal") => {
    setToast({ open: true, message, type });
  }, []);

  // Render via portal so the toast always sits above every stacking context
  // (Vibe Search dropdown, modals, etc.).
  const toastElement = createPortal(
    <Toast
      open={toast.open}
      type={toast.type}
      autoHideDuration={4000}
      onClose={() => setToast((prev) => ({ ...prev, open: false }))}
    >
      {toast.message}
    </Toast>,
    document.body,
  );

  return { showToast, toastElement };
}
