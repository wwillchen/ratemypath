/* eslint-disable @typescript-eslint/no-explicit-any */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const uri = process.env.MONGO_URL || 'OOPS';

export const GET = async (req: NextRequest) => {
  const client = new MongoClient(uri);
  try {
    const code = req.nextUrl.searchParams.get('code');
    const term = req.nextUrl.searchParams.get('term');
    if (!code || !term) {
      return NextResponse.json({ error: 'no code or term' }, { status: 400 });
    }

    const intTerm = parseInt(term, 10);
    const pipeline = [
      {
        $match: {
          subject: code,
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
                    {
                      $eq: ['$term', intTerm],
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
