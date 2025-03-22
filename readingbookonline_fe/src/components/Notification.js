import { ERROR, INFO, MESSAGE, SUCESSS } from "@/utils/constants";
import { Bounce, toast } from "react-toastify";

const options = {
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

export const ShowNotify = (type, message) => {
  switch (type) {
    case SUCESSS: {
      toast.success(message, options);
      break;
    }

    case ERROR: {
      toast.error(message, options);
      break;
    }

    case INFO: {
      toast.info(message, options);
      break;
    }

    case MESSAGE: {
      toast(message, options);
      break;
    }

    default:
      break;
  }
};
