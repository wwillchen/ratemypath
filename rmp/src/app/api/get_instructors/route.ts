/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGO_URL || 'OOPS';

function calculateMean(arr: string[]): string {
  if (arr.length === 0) {
    return '0.0'; // Return 0 or handle empty array as needed
  }
  const newArr: number[] = arr.map((itm) => parseFloat(itm));
  const sum = newArr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const avg = sum / newArr.length;
  return avg.toFixed(3);
}

export const GET = async () => {
  const client = new MongoClient(uri);
  try {
    const pipeline = [
      {
        $unwind: {
          path: '$instructor',
        },
      },
      {
        $group: {
          _id: {
            instructor: '$instructor',
            subject: '$subj_code',
          },
          scores: {
            $push: '$instructor_score',
          },
        },
      },
    ];

    await client.connect();
    const database = client.db('rate_my_path');
    const collection = database.collection('ratings');
    const data = await collection.aggregate(pipeline).toArray();
    const processedData = data.map((e) => ({
      instructor: e._id.instructor,
      subject: e._id.subject,
      score: calculateMean(e.scores),
    }));
    return NextResponse.json({ data: processedData }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  } finally {
    await client.close();
  }
};
