/* eslint-disable no-underscore-dangle */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const uri = process.env.MONGO_URL || 'OOPS';

export const POST = async (req: NextRequest) => {
  const client = new MongoClient(uri);
  const b = await req.json();
  try {
    await client.connect();
    const database = client.db('rate_my_path');
    const collection = database.collection('users');
    console.log(b.email);
    const data = await collection.findOne({
      email: b.email,
    });
    if (data === null) {
      return NextResponse.json(
        { exists: false, auth: false, error: false },
        { status: 200 }
      );
    }
    if (b.password === data.password) {
      return NextResponse.json(
        { exists: true, auth: true, error: false, id: data._id },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { exists: true, auth: false, error: false },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { exists: false, auth: false, error: false },
      { status: 200 }
    );
  }
};
