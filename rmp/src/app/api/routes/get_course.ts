/* eslint-disable @typescript-eslint/no-explicit-any */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const uri = process.env.MONGO_URL || 'OOPS';

export const GET = async (req: NextRequest) => {
  const client = new MongoClient(uri);

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'no code or term' }, { status: 400 });
  }

  try {
    const numid = parseInt(id, 10);

    const pipeline = [
      {
        $match: {
          id: numid,
        },
      },
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
    ];

    await client.connect();
    const database = client.db('rate_my_path');
    const collection = database.collection('courses');
    const data = await collection.aggregate(pipeline).toArray();
    const newData = data.filter((e) => e.data.length > 0);
    return NextResponse.json({ data: newData }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.toString() }, { status: 500 });
  } finally {
    await client.close();
  }
};
