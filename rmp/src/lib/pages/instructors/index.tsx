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
  Spacer,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import useSWR from 'swr';
// import { FaSearch } from 'react-icons/fa';

type SubjectDB = {
  instructor: string;
  subject: string;
  score: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Instructors = () => {
  const [subj, setSubj] = useState<string | null>(null);
  const { data, error, isLoading } = useSWR('/api/get_instructors', fetcher);

  if (isLoading) return <Spinner size="xl" colorScheme="blue" />;
  if (error) return <Heading>Error Ocurred</Heading>;
  const inData: SubjectDB[] = data.data;
  const filtered = inData.filter((i: SubjectDB) => {
    return subj === null || i.subject === subj;
  });
  console.log(filtered);
  const subjectFilters = Array.from(new Set(inData.map((i) => i.subject)));
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
        <Flex>
          <Heading display={isLoading ? 'none' : 'flex'}>
            Duke Instructors
          </Heading>
          <Spacer />
          <Select
            onChange={(e) => {
              setSubj(e.target.value);
            }}
            maxW={{ base: '100%', md: '20%' }}
          >
            <option value="Select">Select</option>
            {subjectFilters.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
        </Flex>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {inData
            .filter((i: SubjectDB) => {
              // Check if selectedSubject is null or matches the subject of the instructor
              return subj === null || subj === 'Select' || i.subject === subj;
            })
            .map((i: SubjectDB, n: number) => {
              return (
                <Flex
                  p={3}
                  bg="gray.600"
                  border="2px white dotted"
                  m={4}
                  rounded="lg"
                  direction="column"
                  // eslint-disable-next-line react/no-array-index-key
                  key={n}
                >
                  <Heading>{i.instructor}</Heading>
                  <Text>{i.subject}</Text>
                  <Text>{i.score}</Text>
                </Flex>
              );
            })}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default Instructors;
