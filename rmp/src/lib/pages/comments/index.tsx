// src/lib/pages/comments/index.tsx

'use client';

import { Box, Button, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const Comments = () => {
  const [reference, setReference] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const response = await fetch('/api/get_comments');
    const data = await response.json();
    if (response.ok) {
      setComments(data.data);
    } else {
      // Handle error
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const submitComment = async () => {
    const commentData = {
      reference,
      text: commentText,
    };

    try {
      await fetch('/api/get_comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
    } catch (error) {
      // Handle network error
    }

    // Reload the page to refresh comments
    window.location.reload();
  };

  return (
    <Box p={5}>
      <Heading mb={4}>Submit a Comment</Heading>
      <FormControl>
        <FormLabel htmlFor='reference'>Course or Instructor</FormLabel>
        <Input
          id='reference'
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Course name or Instructor's name"
        />
        <FormLabel htmlFor='commentText' mt={2}>Comment</FormLabel>
        <Input
          id='commentText'
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Your comment"
        />
        <Button onClick={submitComment} mt={4}>
          Submit
        </Button>
      </FormControl>
      <Box mt={5}>
        {comments.map((comment, index) => (
          <Box key={index} p={3} shadow="md" borderWidth="1px" mb={3}>
            <Text fontWeight="bold">{comment.reference}</Text>
            <Text mt={1}>{comment.text}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Comments;
