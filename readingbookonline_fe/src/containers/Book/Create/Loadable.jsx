import loadable from "@/utils/loadable";

const LoadableCreate = loadable(() => import("./index"));

export default LoadableCreate;

