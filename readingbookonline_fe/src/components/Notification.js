import { ERROR, INFO, MESSAGE, SUCESSS } from "@/utils/constants";
import { Bounce, toast } from "react-toastify";

const initialOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Bounce,
};

export const ShowNotify = (type, message, option = {}) => {
  const configOption = { ...initialOptions, ...option };
  switch (type) {
    case SUCESSS: {
      toast.success(message, configOption);
      break;
    }

    case ERROR: {
      toast.error(message, configOption);
      break;
    }

    case INFO: {
      toast.info(message, configOption);
      break;
    }

    case MESSAGE: {
      toast(message, configOption);
      break;
    }

    default:
      break;
  }
};
