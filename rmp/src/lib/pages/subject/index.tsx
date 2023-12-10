/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

'use client';

import {
  Flex,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
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
  Spacer,
  Select,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
// import { FaSearch } from 'react-icons/fa';

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Subject = ({ code }: { code: string }) => {
  const [term, SetTerm] = useState(8806);
  const [ratingFilter, SetRatingFilter] = useState(0);

  const { data, error, isLoading } = useSWR(
    `/api/get_classes?code=${code}&term=${term}`,
    fetcher
  );

  if (isLoading) return <Spinner size="xl" colorScheme="blue" />;
  if (error) return <Heading>Error Ocurred</Heading>;
  if (data.error) return <Heading>{JSON.stringify(data.error)}</Heading>;
  console.log(data);

  const newData = data.data.filter(
    (v: CourseData) => v.data[0].course_rating > ratingFilter
  );

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
        <Flex my={3}>
          <Heading display={isLoading ? 'none' : 'flex'}>
            {code} Classes
          </Heading>
          <Spacer />
          <Select
            onChange={(e) => {
              SetTerm(parseInt(e.target.value, 10));
            }}
            maxW={{ md: '10%' }}
          >
            <option value={8806}>Spring 2023</option>
            <option value={8526}>Fall 2022</option>
          </Select>
        </Flex>
        <Divider />
        <Flex direction={{ base: 'column', md: 'row' }}>
          <Flex
            p={8}
            m={5}
            rounded="lg"
            direction="column"
            minW="25%"
            bg="gray.500"
            w={{ base: '100%', md: '25%' }}
          >
            <Heading>Filters Panel</Heading>
            <Box p={1} my={2}>
              <Text fontWeight="bold">Course Rating</Text>
              <Slider
                colorScheme="blue"
                onChange={(e) => {
                  console.log(e);
                  SetRatingFilter(e);
                }}
                defaultValue={0}
                min={0}
                max={5}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={4}>
                  <Box>{ratingFilter}</Box>
                </SliderThumb>
              </Slider>
            </Box>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 2 }}>
            {newData.map((i: CourseData) => {
              return (
                <Link href={`/course/${i.id}`}>
                  <Flex
                    bg="gray.600"
                    p={3}
                    m={4}
                    rounded="md"
                    direction="column"
                    key={i.id}
                  >
                    <Text color="blue.200">
                      {i.subject} {i.catalog}
                    </Text>
                    <Heading size="md">{i.title}</Heading>
                    <Text my={1}>
                      <strong>Offered</strong>: {i.offered_pretty}
                    </Text>
                    <Text my={1}>
                      <strong>Instructors</strong>:{' '}
                      {Array.from(new Set(i.data[0].instructor)).join(', ')}
                    </Text>
                    <Text fontWeight="bold" my={1}>
                      Ratings
                    </Text>
                    <Divider />
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
                            <Td>{i.data[0].course_rating}</Td>
                          </Tr>
                          <Tr>
                            <Td>Difficulty</Td>
                            <Td>{i.data[0].difficulty}</Td>
                          </Tr>
                          <Tr>
                            <Td>Hours a week</Td>
                            <Td>{i.data[0].hours}</Td>
                          </Tr>
                          <Tr>
                            <Td>Instructors</Td>
                            <Td>{i.data[0].instructor_score}</Td>
                          </Tr>
                          <Tr>
                            <Td>Intellectual Stimulation</Td>
                            <Td>{i.data[0].intellectually_stimulating}</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    {/* <Text>{JSON.stringify(i.data[0])}</Text> */}
                  </Flex>
                </Link>
              );
            })}
          </SimpleGrid>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Subject;
