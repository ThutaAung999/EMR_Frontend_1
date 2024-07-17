import React, { useContext } from 'react';
import instance from '../../../utils/axios'; 
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Title, Container } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContext';
import { notifications } from '@mantine/notifications';
import { FaTimesCircle } from "react-icons/fa"; 

const Signup: React.FC = () => {

  const { setAuth } = useContext(AuthContext)!;
  const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },

    validate: {
      name: (value) => (value ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters long'),
      passwordConfirm: (value, values) => value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSignup = async (values: typeof form.values) => {
    try {
      
      const response = await instance.post('/api/users/signup', values);

      
      console.log('Registration successful:', response.data);
      setAuth({
        token: response.data.token,
        isAuthenticated: true,
        userImage: response.data.userImage
      });

      setNotification({ message: 'Signup  successful!', type: 'success' });
      navigate('/'); 
      console.log("notification :",notification);

      // history.push('/login');
    } catch (error) {

      console.error('Registration error:', error);

      setNotification({ message: 'Login failed. Please check your credentials and try again.', type: 'error' });
      form.reset();

      // showToast('error', 'Registration failed. Please try again.');
      notifications.show({            
        title: 'Fail',
        message: 'Signup not uccessfully',
        color: 'red',
        autoClose: 3000,
        icon: <FaTimesCircle size={20} />,                        
        withCloseButton: true,
        
      })
    }
  };

  return (
    <Container size={420} my={40} className="w-full flex flex-grow flex-col">
      <Title align="center">Sign Up</Title>
      <Paper withBorder shadow="md"  p="lg" mt="lg" radius="md" className="p-3">
        <form onSubmit={form.onSubmit(handleSignup)}>
          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps('name')}
            className="mb-4"
          />
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
            className="mb-4"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps('passwordConfirm')}
            className="mb-4"
          />
          <Button fullWidth mt="xl" type="submit">
            Sign Up
          </Button>
        </form>
        <div className="mt-6 text-center">
          sign in instead <Link to="/login" className="text-blue-500 hover:underline">Sign in</Link>
        </div>

      </Paper>
    </Container>
  );
};

export default Signup;
