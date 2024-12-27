import  { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthContext";

import { notifications } from "@mantine/notifications";

import instance from "../api/axios";
import { useForm } from "@mantine/form";

interface SignupValues {
  email: string;
  password: string;
  name: string;
  passwordConfirm: string;
}

export const useSignup = () => {
  const { setAuth } = useContext(AuthContext)!;
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignupValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },

    validate: {
      name: (value) => (value ? null : "Name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8
          ? null
          : "Password must be at least 8 characters long",
      passwordConfirm: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSignup = async (values: SignupValues) => {
    setLoading(true);
    try {
      const response = await instance.post("/api/users/signup", values);
      const {token,data} = response.data;
      console.log("Registration successful:", response.data);
      setAuth({
        token: token,
        isAuthenticated: true,
        userImage: data?.user.userImage,
        name: data?.user?.name,
        role: data?.user?.role,
      });

      setNotification({ message: "Signup  successful!", type: "success" });
      navigate("/");
      console.log("notification :", notification);

      // history.push('/login');
    } catch (error) {
      console.error("Registration error:", error);

      setNotification({
        message: "Login failed. Please check your credentials and try again.",
        type: "error",
      });
      form.reset();

      // showToast('error', 'Registration failed. Please try again.');
      
      notifications.show({
        title: "Fail",
        message: "Signup not uccessfully",
        color: "red",
        autoClose: 3000,
       
        withCloseButton: true,
      });
    }finally{
        setLoading(false);
  }

}

  return {
    form,
    handleSignup,
    notification,
    setNotification,
    loading,
    
  };

};
