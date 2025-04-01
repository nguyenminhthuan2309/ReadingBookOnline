import loadable from "@/utils/loadable";

const LoadableErrorNetwork = loadable(() => import("./index"));

export default LoadableErrorNetwork;
