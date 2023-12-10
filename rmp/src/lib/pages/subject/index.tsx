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
  Checkbox,
  CheckboxGroup,
  Stack,
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
  const [displayRating, setDisplayRating] = useState(0);
  const [selectedAok, setSelectedAok] = useState('');
  const [selectedMoiq, setSelectedMoiq] = useState('');
  const [hoursFilter, setHoursFilter] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState(0);

  const { data, error, isLoading } = useSWR(
    `/api/get_classes?code=${code}&term=${term}`,
    fetcher
  );

  if (isLoading) return <Spinner size="xl" colorScheme="blue" />;
  if (error) return <Heading>Error Ocurred</Heading>;
  if (data.error) return <Heading>{JSON.stringify(data.error)}</Heading>;
  console.log(data);
  // Get all unique values of Areas of knowledge and modes of inquiry
  const allAoks = [...new Set(data.data.flatMap((v: CourseData) => v.aok))];
  const allMoiqs = [...new Set(data.data.flatMap((v: CourseData) => v.moiq))];
  // Max floor values for quantitative filters
  const maxHours = Math.floor(Math.max(...data.data.map((v: CourseData) => v.data[0].hours)));
  const maxDifficulty = Math.floor(Math.max(...data.data.map((v: CourseData) => v.data[0].difficulty)));
  const maxRating = Math.floor(Math.max(...data.data.map((v: CourseData) => v.data[0].course_rating)));
  
  // Construct filter to Union
  const newData = data.data.filter(
    (v: CourseData) =>
      v.data[0].course_rating > ratingFilter &&
      v.data[0].hours > hoursFilter &&
      v.data[0].difficulty > difficultyFilter &&
      (selectedAok.length === 0 || selectedAok.every(aok => v.aok.includes(aok))) &&
      (selectedMoiq.length === 0 || selectedMoiq.every(moiq => v.moiq.includes(moiq)))
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
                  SetRatingFilter(e);
                  setDisplayRating(e);
                }}
                defaultValue={0}
                min={0}
                max={maxRating}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={4}>
                  <Box>{displayRating}</Box>
                </SliderThumb>
              </Slider>
            </Box>
            <Box p={1} my={2}>
              <Text fontWeight="bold">Hours per Week</Text>
              <Slider
                colorScheme="blue"
                onChange={(e) => {
                  setHoursFilter(e);
                }}
                defaultValue={0}
                min={0}
                max={maxHours}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={4}>
                  <Box>{hoursFilter}</Box>
                </SliderThumb>
              </Slider>
            </Box>
            <Box p={1} my={2}>
              <Text fontWeight="bold">Difficulty</Text>
              <Slider
                colorScheme="blue"
                onChange={(e) => {
                  setDifficultyFilter(e);
                }}
                defaultValue={0}
                min={0}
                max={maxDifficulty}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={4}>
                  <Box>{difficultyFilter}</Box>
                </SliderThumb>
              </Slider>
            </Box>
            <Box p={1} my={2} overflowY="auto" maxH="200px"> 
              <Text fontWeight="bold">Area of Knowledge</Text>
              <CheckboxGroup
                colorScheme="blue"
                defaultValue={[]}
                onChange={(values) => {
                  setSelectedAok(values as string[]);
                }}
              >
                <Stack direction="column" spacing={4}>
                  {allAoks.map((aok) => (
                    <Checkbox value={aok} size="sm">{aok}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>
            <Box p={1} my={2} overflowY="auto" maxH="200px"> 
              <Text fontWeight="bold">Mode of Inquiry</Text>
              <CheckboxGroup
                colorScheme="blue"
                defaultValue={[]}
                onChange={(values) => {
                  setSelectedMoiq(values as string[]);
                }}
              >
                <Stack direction="column" spacing={4}>
                  {allMoiqs.map((moiq) => (
                    <Checkbox value={moiq} size="sm">{moiq}</Checkbox> 
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 2 }}>
            {/* display no courses found if no courses */}
            {newData.length === 0 ? (
              <Text>Sorry, no courses found. Please set new filter values.</Text>
            ) : (
              newData.map((i: CourseData) => {
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
                    <Text my={1}>
                      <strong>Areas of Knowledge</strong>: {i.aok.join(', ')}
                    </Text>
                    <Text my={1}>
                      <strong>Modes of Inquiry</strong>: {i.moiq.join(', ')}
                    </Text>
                    <Text fontWeight="bold" mt={0} mb={0}>
                      Ratings
                    </Text>
                    <TableContainer mt={0}>
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
            })
            )}
          </SimpleGrid>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Subject;
