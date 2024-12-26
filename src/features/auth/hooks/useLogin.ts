import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import instance from "../api/axios";
import { useForm } from "@mantine/form";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext";
  
interface LoginValues {
  email: string;
  password: string;
}

export const useLogin = () => {
  const { setAuth } = useContext(AuthContext)!;
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8
          ? null
          : "Password must be at least 8 characters long",
    },
  });

  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    try {
      const response = await instance.post("/api/users/login", values);
      const { token, data } = response.data;
      setAuth({
        token: token,
        isAuthenticated: true,
        userImage: data?.user.userImage,
        name: data?.user?.name,
        role: data?.user?.role,
      });
      setNotification({ message: "Login successful!", type: "success" });
      navigate("/"); // Redirect to the home page upon successful login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Login error:", error.response.data);
          setNotification({
            message:
              error.response.data.message ||
              "Login failed. Please check your credentials and try again.",
            type: "error",
          });
        } else if (error.request) {
          console.error(
            "Login error: No response received from server",
            error.request
          );
          setNotification({
            message:
              "Login failed. No response from server. Please try again later.",
            type: "error",
          });
        } else {
          console.error("Login error:", error.message);
          setNotification({
            message:
              "Login failed. An unexpected error occurred. Please try again later.",
            type: "error",
          });
        }
      } else {
        console.error("Login error:", error);
        setNotification({
          message:
            "Login failed. An unknown error occurred. Please try again later.",
          type: "error",
        });
      }
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    handleLogin,
    notification,
    setNotification,
    loading,
  };
};
