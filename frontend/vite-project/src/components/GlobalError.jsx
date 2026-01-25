import { useUi } from "../api/UiContext";
import { useEffect } from "react";
import { toast } from "react-toastify";


export default function GlobalError() {
  const { error, clearError } = useUi();

 useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  return null;
}
