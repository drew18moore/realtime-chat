import { useMutation } from "@tanstack/react-query";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AxiosError, AxiosResponse } from "axios";

const signUp = ({
  display_name,
  username,
  password,
  repeatPassword,
}: {
  display_name: string;
  username: string;
  password: string;
  repeatPassword: string;
}): Promise<AxiosResponse<User>> => {
  if (password !== repeatPassword)
    return Promise.reject({
      response: { data: { message: "Passwords do not match" } },
    });
  return api.post(
    "/api/auth/signup",
    { display_name, username, password },
    { withCredentials: true }
  );
};

const useSignup = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  return useMutation(signUp, {
    onSuccess: (data) => {
      setCurrentUser(data.data);
      navigate("/");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      throw err;
    },
  });
};

export default useSignup;
