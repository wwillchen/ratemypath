// src/app/api/get_comments/route.ts

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const uri = process.env.MONGO_URL || 'YourMongoDBConnectionStringHere';

export const POST = async (req: NextRequest) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db('rate_my_path');
    const collection = database.collection('comments');

    const commentData = await req.json();
    const result = await collection.insertOne({
      reference: commentData.reference,
      text: commentData.text,
      createdAt: new Date(),
    });

    return NextResponse.json({ data: result.ops[0] }, { status: 201 });
  } finally {
    await client.close();
  }
};

export const GET = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db('rate_my_path');
    const collection = database.collection('comments');

    const comments = await collection.find({}).toArray(); // Fetch all comments

    return NextResponse.json({ data: comments }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 });
  } finally {
    await client.close();
  }
};