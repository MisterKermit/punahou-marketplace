// import "jsr:@std/dotenv/load";
import { openKv } from "@deno/kv";

// const kvAccessToken = Deno.env.get("KV_ACCESS_TOKEN");
// if (!kvAccessToken) {
//     throw new Error("KV_ACCESS_TOKEN is not defined");
// }

export const db = await openKv(); // In memory database for now
