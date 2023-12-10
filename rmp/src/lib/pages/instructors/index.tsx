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
  Input,
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
  // State hooks for selected subject and search term
  const [subj, setSubj] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  // Using SWR to fetch data from the API
  const { data, error, isLoading } = useSWR('/api/get_instructors', fetcher);
  // Handling loading and error states
  if (isLoading) return <Spinner size="xl" colorScheme="blue" />;
  if (error) return <Heading>Error Ocurred</Heading>;
  const inData: SubjectDB[] = data.data;
  // Filtering the data based on the selected subject
  const filtered = inData.filter((i: SubjectDB) => {
    return subj === null || i.subject === subj;
  });
  console.log(filtered);
   // Creating a list of unique subjects for the dropdown
  const subjectFilters = Array.from(new Set(inData.map((i) => i.subject)));
  return (
    <Flex
      direction="column"
      alignItems="center"
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
          <Input
            placeholder="Search for instructor"
            onChange={(e) => setSearchTerm(e.target.value)} // Update the search term when the input changes
            maxW={{ base: '100%', md: '20%' }}
          />
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
              // Check if selectedSubject is null or matches the subject of the instructor     // And check if the instructor
              return (subj === null || subj === 'Select' || i.subject === subj) && i.instructor.toLowerCase().includes(searchTerm.toLowerCase());
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
                  <Text>Subject: {i.subject}</Text>
                  <Text>Average Course Rating: {i.score}</Text>
                </Flex>
              );
            })}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default Instructors;
