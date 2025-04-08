import { getItem } from "./localStorage";

export const USER_INFO = "USER_INFO";
export const ACCESS_TOKEN ="ACCESS_TOKEN"
export const EXPIRED_IN = "EXPIRED_IN"

export const SUCESSS = "success";
export const ERROR = "error";
export const INFO = "info";
export const MESSAGE = "message";

export const COMPLETED = "Completed";
export const FAVORITES = "Favorites";
export const RECENTLY_READ = "RecentlyRead";
export const NEWBOOK = "NewBook";

const userInfo = getItem(USER_INFO);
export const IS_ADMIN = userInfo?.role?.id === 1;
export const IS_MANAGER = userInfo?.role?.id === 2;
