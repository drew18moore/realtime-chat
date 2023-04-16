import { axiosPrivate } from "../api/api";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "../contexts/AuthContext";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { currentUser } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${currentUser?.accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(err);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [currentUser, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
