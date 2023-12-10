/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

'use client';

import {
  Flex,
  Heading,
  chakra,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  SimpleGrid,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import useSWR from 'swr';
// import { FaSearch } from 'react-icons/fa';

// Type definitions
type Review = {
  term: number;
  instructor: string[];
  intellectually_stimulating: number;
  course_rating: number;
  instructor_score: number;
  difficulty: number;
  hours: number;
};

type CourseData = {
  id: number;
  title: string;
  subject: string;
  catalog: string;
  offered_filter: string;
  offered_pretty: string;
  description: string;
  units: number;
  requirements: string | null;
  moiq: string[];
  aok: string[];
  data: Review[];
};

type SemMapType = {
  [key: number]: string;
};
// Mapping from term numbers to term names
const semMap: SemMapType = {
  8806: 'Spring 2023',
  8526: 'Fall 2022',
};

// Fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Course component
const Course = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useSWR(
    `/api/get_course?id=${id}`,
    fetcher
  );

  // Handling loading, error, and data error states
  if (isLoading) return <Spinner size="xl" colorScheme="blue" />;
  if (error) return <Heading>Error Ocurred</Heading>;
  if (data.error) return <Heading>{JSON.stringify(data.error)}</Heading>;
  
  // Processing fetched data
  const subj: CourseData = data.data[0];
  const instructors: string[] = [];
  console.log(subj.data);
  subj.data.forEach((i: Review) => {
    instructors.push(...i.instructor);
  });
  const res = Array.from(new Set(instructors));
  return (
    <Flex
      direction="column"
      alignItems="center"
      gap={4}
      mx="auto"
      mb={8}
      p={10}
      w="full"
    >
      <Heading>
        <chakra.span color="blue.200">
          {subj.subject}-{subj.catalog}:
        </chakra.span>{' '}
        {subj.title}
      </Heading>
      <Divider />
      <Flex direction="column" alignItems="left">
        <Box my={2}>
          <Heading color="blue.200" size="sm">
            Description
          </Heading>
          <Divider />
          <Text>{subj.description.replace(subj.requirements || '', '')}</Text>
        </Box>
        <Box my={2}>
          <Heading color="blue.200" size="sm">
            Requirements
          </Heading>
          <Divider />
          <Text>{subj.requirements || 'None'}</Text>
        </Box>
        <Box my={2}>
          <Heading color="blue.200" size="sm">
            Past Instructors
          </Heading>
          <Divider />
          <Text>{res.join(', ')}</Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Box mx={2} my={2}>
            <Heading color="blue.200" size="sm">
              Offered
            </Heading>
            <Divider />
            <Text>{subj.offered_pretty}</Text>
          </Box>
          <Box mx={2} my={2}>
            <Heading color="blue.200" size="sm">
              Units
            </Heading>
            <Divider />
            <Text>{subj.units}</Text>
          </Box>
          <Box mx={2} my={2}>
            <Heading color="blue.200" size="sm">
              Areas of Knowledge
            </Heading>
            <Divider />
            <Text>{subj.aok.join(', ')}</Text>
          </Box>
          <Box mx={2} my={2}>
            <Heading color="blue.200" size="sm">
              Modes of Inquiry
            </Heading>
            <Divider />
            <Text>{subj.moiq.join(', ')}</Text>
          </Box>
        </SimpleGrid>
        <Box>
          <Accordion>
            {subj.data.map((i: Review) => (
              <AccordionItem>
                <AccordionButton>
                  <Box
                    rounded="lg"
                    p={4}
                    as="span"
                    flex="1"
                    textAlign="left"
                    bg="gray.600"
                    color="blue.200"
                  >
                    {semMap[i.term]}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Criteria</Th>
                          <Th>Value</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Rating</Td>
                          <Td>{i.course_rating}</Td>
                        </Tr>
                        <Tr>
                          <Td>Difficulty</Td>
                          <Td>{i.difficulty}</Td>
                        </Tr>
                        <Tr>
                          <Td>Hours a week</Td>
                          <Td>{i.hours}</Td>
                        </Tr>
                        <Tr>
                          <Td>Instructors</Td>
                          <Td>{i.instructor_score}</Td>
                        </Tr>
                        <Tr>
                          <Td>Intellectual Stimulation</Td>
                          <Td>{i.intellectually_stimulating}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Course;
