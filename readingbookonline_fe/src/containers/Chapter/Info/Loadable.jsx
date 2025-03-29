import loadable from "@/utils/loadable";

const LoadableInfo = loadable(() => import("./index"));

export default LoadableInfo;

