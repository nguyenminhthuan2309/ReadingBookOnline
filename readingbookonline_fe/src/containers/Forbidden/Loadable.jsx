import loadable from "@/utils/loadable";

const LoadableForbidden = loadable(() => import("./index"));

export default LoadableForbidden;
