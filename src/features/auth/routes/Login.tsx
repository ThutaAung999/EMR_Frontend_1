import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import instance from '../../../utils/axios'; // Import the custom Axios instance
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { AuthContext } from '../providers/AuthContext';

const Login: React.FC = () => {
  const { setAuth } = useContext(AuthContext)!;
  const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate(); // React Router's hook for navigation

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters long'),
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    try {
      const response = await instance.post('/api/users/login', values);
      console.log('Login successful:', response.data);
      setAuth({
        token: response.data.token,
        isAuthenticated: true,
        userImage:response.data.userImage,
      });
      setNotification({ message: 'Login successful!', type: 'success' });
      navigate('/'); // Redirect to the home page upon successful login
    } catch (error) {
      console.error('Login error:', error);
      setNotification({ message: 'Login failed. Please check your credentials and try again.', type: 'error' });
      form.reset(); // Clear form fields on login failure
    }
  };

  return (
    <Container size={420} className="min-h-screen flex flex-grow w-full items-center justify-center">
      {notification && (
        <Notification
          icon={notification.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
          color={notification.type === 'success' ? 'teal' : 'red'}
          onClose={() => setNotification(null)}
          className="absolute top-4"
        >
          {notification.message}
        </Notification>
      )}
      <Paper withBorder shadow="md" p={30} radius="md" className="w-full">
        <Title align="center" className="mb-6 text-2xl font-bold">Log In</Title>
        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
            className="mb-4"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
            className="mb-6"
          />
          <Button fullWidth mt="xl" type="submit" className="bg-blue-500 hover:bg-blue-600">
            Log In
          </Button>
        </form>
        <div className="mt-6 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </div>
      </Paper>
    </Container>
  );
};

export default Login;
