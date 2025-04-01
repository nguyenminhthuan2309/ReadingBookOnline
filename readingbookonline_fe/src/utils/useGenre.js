import { bookAPI } from "@/common/api";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "./request";

export const getBookGenre = async () => {
  try {
    const url = bookAPI.getBookGenre;
    const response = await getAPI(url);
    const { data } = response.data.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.log(error);
    throw new Error("Fail to fetch genre");
  }
};

export const useGenres = () => {
  return useQuery({
    queryKeyL: ["bookGenres"],
    queryFn: getBookGenre,
    staleTime: 1000 * 60 * 10,
  });
};
