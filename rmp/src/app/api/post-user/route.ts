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
      await collection.insertOne({
        email: b.email,
        password: b.password,
      });
      return NextResponse.json(
        { res: true, message: 'User created' },
        { status: 200 }
      );
    }
    console.log(data);
    return NextResponse.json(
      { res: false, message: 'User already exists. Log In' },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { res: false, message: 'Internal Error' },
      { status: 500 }
    );
  }
};
