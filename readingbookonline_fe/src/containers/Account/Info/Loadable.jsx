import loadable from "@/utils/loadable";

const LoadableAccountInfo = loadable(() => import("./index"));

export default LoadableAccountInfo;

