import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { v4 as uuidv4, validate } from 'uuid';
import { db } from "../../../services/database.ts";

type ListingID = string | null;

const validate_listingId = (listingId: listingId, callback) => {
  if (validate(listingId)) {
    return callback();
  } else {
    return error(400, { message: "Query id is not valid" });
  }
}



export const GET: RequestHandler = async ({ url }) => {
  const listingId: string | null = url.searchParams.get('id');

  if (listingId) {
    return validate_listingId(listingId, async () => {
      const res = await db.get(["listings", listingId]);
      return json(res);
    });
  }

  const res = await Array.fromAsync(
    db.list({ prefix: ["listings"] })
  );

  return json(res);
};

export const POST: RequestHandler = async ({ request }) => {
  const listingToAdd = await request.json();
  const id_ = uuidv4();

  const res = await db.set(["listings", id_], listingToAdd);
  return json(res);
};

// Probably no need for PUT
export const PATCH: RequestHandler = async ({ request, url }) => {
  const changes = await request.json(); // TODO: Validate changes

  const listingId: string | null = url.searchParams.get('id');

  if (listingId) {
    return validate_listingId(listingId, async () => {
      const currentData = await db.get(["listings", listingId]);

      const res = await db.set(
        ["listings", listingId],
        Object.assign(currentData.value, changes)
      );

      return json(res);
    });
  }
}

export const DELETE: RequestHandler = async ({ request, url }) => {
  const listingId: string | null = url.searchParams.get('id');

  if (listingId) {
    return validate_listingId(listingId, async () => {
      await db.delete(["listings", listingId]);
      return json({ "message": "success" })
    });
  }
}

export const fallback: RequestHandler = async ({ request }) => {
	return error(415, `${request.method} unsupported!`);
};
