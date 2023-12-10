'use client';

import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { createHash } from 'crypto';
import React from 'react';

const SignUpForm = () => {
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const hash = createHash('sha256')
      .update(data.get('password'))
      .digest('hex');

    const formData = {
      email: data.get('email'),
      password: hash,
    };

    // Here you would usually send data to your backend or authentication service

    const res = await fetch('/api/post-user', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const js = await res.json();
    if (js.res === true) {
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Account Creation Failed',
        description: js.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box width="100%" maxWidth="400px" margin="0 auto" padding="4">
      <Heading mb="6">Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="email" isRequired mb="4">
          <FormLabel>Email address</FormLabel>
          <Input name="email" type="email" placeholder="Enter your email" />
        </FormControl>
        <FormControl id="password" isRequired mb="6">
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
          />
        </FormControl>
        <Button width="100%" type="submit" colorScheme="blue">
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignUpForm;
