import loadable from "@/utils/loadable";

const LoadableList = loadable(() => import("./index"));

export default LoadableList;

