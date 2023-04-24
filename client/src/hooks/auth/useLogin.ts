import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AxiosError, AxiosResponse } from "axios";

const login = ({ username, password }: { username: string, password: string }): Promise<AxiosResponse<User>> => {
  return api.post(
    "/api/auth/login",
    { username, password },
    { withCredentials: true }
  );
};

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  return useMutation(
    login, {
    onSuccess: (data) => {
      console.log(data);
      setCurrentUser(data.data)
      navigate("/")
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw err
    },
  });
};

export default useLogin;
