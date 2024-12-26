import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Loader,
  Notification,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { IconCheck, IconX } from "@tabler/icons-react";

export const Signup = () => {
  const { form, handleSignup, loading, notification, setNotification } =
    useSignup();

  return (
    <Container size={420} my={40} className="w-full flex flex-grow flex-col">
      {notification && (
        <Notification
          icon={
            notification.type === "success" ? (
              <IconCheck size={18} />
            ) : (
              <IconX size={18} />
            )
          }
          color={notification.type === "success" ? "teal" : "red"}
          onClose={() => setNotification(null)}
          className="absolute top-4"
        >
          {notification.message}
        </Notification>
      )}

    
      <Paper withBorder shadow="md" p="lg" mt="lg" radius="md" className="p-3">
      <Title align="center" className="mb-6 text-2xl font-bold">
          Sign Up
        </Title>

        <form onSubmit={form.onSubmit(handleSignup)}>
          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps("name")}
            className="mb-4"
            disabled={loading}
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
            className="mb-4"
            disabled={loading}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            className="mb-4"
            disabled={loading}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps("passwordConfirm")}
            className="mb-4"
            disabled={loading}
          />
          <Button
            fullWidth
            mt="xl"
            type="submit"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? <Loader size="sm" color="white" /> : "Sign Up"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          sign in instead{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      </Paper>
    </Container>
  );
};

export default Signup;
