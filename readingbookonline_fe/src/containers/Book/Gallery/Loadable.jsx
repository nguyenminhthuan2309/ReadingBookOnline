import loadable from "@/utils/loadable";

const LoadableGallery = loadable(() => import("./index"));

export default LoadableGallery;
