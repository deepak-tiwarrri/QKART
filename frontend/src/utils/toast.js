import { toast as sonnerToast } from "sonner";
import { toast as toastifyToast } from "react-toastify";

/**
 * Unified toast utility supporting both Sonner (modern dark UI)
 * and React-Toastify (accessible role="alert" for RTL testing).
 */
export const toast = {
  success: (msg, options) => {
    sonnerToast.success(msg, options);
    toastifyToast.success(msg, options);
  },
  error: (msg, options) => {
    sonnerToast.error(msg, options);
    toastifyToast.error(msg, options);
  },
  warning: (msg, options) => {
    sonnerToast.warning(msg, options);
    toastifyToast.warning(msg, options);
  },
  info: (msg, options) => {
    sonnerToast.info(msg, options);
    toastifyToast.info(msg, options);
  },
};

export default toast;
