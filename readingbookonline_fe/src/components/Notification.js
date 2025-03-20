import { toast } from "react-toastify";

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
    case "success": {
      toast.success(message, options);
      break;
    }

    case "error": {
      toast.error(message, options);
      break;
    }

    case "info": {
      toast.info(message, options);
      break;
    }

    case "message": {
      toast(message, options);
      break;
    }

    default:
      break;
  }
};
