/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

'use client';

import {
  Flex,
  Heading,
  Box,
  Text,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import Link from 'next/link';
import useSWR from 'swr';
// import { FaSearch } from 'react-icons/fa';

type Subject = {
  color: string;
  _id: string;
  code: string;
  name: string;
  enabled: boolean;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home = () => {
  const { data, error, isLoading } = useSWR('/api/get_subjects', fetcher);

  if (isLoading) return <Spinner size="xl" colorScheme="blue" />;
  if (error) return <Heading>Error Ocurred</Heading>;
  console.log(data);
  return (
    <Flex
      direction="column"
      alignItems="center"
      // justifyContent="center"
      gap={4}
      mb={8}
      w="full"
    >
      <Box>
        <Heading display={isLoading ? 'none' : 'flex'}>Chose Subject</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {data.data.map((i: Subject) => {
            if (i.enabled) {
              return (
                <Link href={`/subject/${i.code}`}>
                  <Flex
                    p={3}
                    m={4}
                    rounded="md"
                    direction="column"
                    bg={i.color}
                    key={i._id}
                  >
                    <Heading>{i.code}</Heading>
                    <Text>{i.name}</Text>
                  </Flex>
                </Link>
              );
            }
            return <Box display="none" />;
          })}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default Home;
