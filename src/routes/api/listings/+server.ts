import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { v4 as uuidv4, validate } from 'uuid';
import { db } from "../../../services/database.ts";

export const GET: RequestHandler = async ({ url }) => {
  const listingId: string | null = url.searchParams.get('id'); // /listings?id={id}

  if (listingId) {
    if (validate(listingId)) {
      const res = await db.get(["listings", listingId]);
      return new json(res);
    } else {
      return new error(400, { message: "Query id is not valid" });
    }
  }

  const res = await Array.fromAsync(
    db.list({ prefix: ["listings"] })
  );

  return json(res);
};

export const POST: RequestHandler = async ({ req }) => {
  const listingToAdd = await request.json();
  const res = await db.set(["listings", uuidv4()], listingToAdd);
};
