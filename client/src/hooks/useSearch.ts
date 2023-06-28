import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate";

const useSearch = (query: string) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery<SearchResults>(
    ["searchUsers", query.trim()],
    async () => {
      const res = await axiosPrivate.get("/api/users", {
        params: { search: query.trim() },
      });
      return res.data;
    },
    { enabled: query.trim() !== "" }
  );
};

export default useSearch;
