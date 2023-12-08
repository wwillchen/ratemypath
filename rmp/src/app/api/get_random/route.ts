/* eslint-disable @typescript-eslint/no-explicit-any */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGO_URL || 'OOPS';
const client = new MongoClient(uri);

export const GET = async () => {
  try {
    await client.connect();
    const database = client.db('rate_my_path');
    const collection = database.collection('courses');

    const documents = await collection
      .aggregate([
        {
          $lookup: {
            from: 'ratings',
            let: {
              course: '$catalog',
              subject: '$subject',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$$course', '$code'],
                      },
                      {
                        $eq: ['$$subject', '$subj_code'],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'data',
          },
        },
        { $sample: { size: 1 } },
      ])
      .toArray();
    return NextResponse.json({ data: documents }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  } finally {
    await client.close();
  }
};
