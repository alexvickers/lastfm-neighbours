import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response(JSON.stringify({ error: "Missing username" }), {
      status: 400,
    });
  }

  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing API key" }), {
      status: 500,
    });
  }

  // Fetch user info
  const userInfoRes = await fetch(
    `${BASE_URL}?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`
  );
  const userInfo = await userInfoRes.json();

  const country = userInfo?.user?.country;
  if (!country) {
    return new Response(JSON.stringify({ error: "User country not found" }), {
      status: 404,
    });
  }

  const cacheKey = `top-artists:${country}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return new Response(
      JSON.stringify({ country, source: "cache", artists: cached }),
      { status: 200 }
    );
  }

  const topArtistsRes = await fetch(
    `${BASE_URL}?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json&limit=10`
  );
  const topArtistsData = await topArtistsRes.json();

  const artists =
    topArtistsData?.topartists?.artist?.map((artist) => ({
      name: artist.name,
      playcount: artist.playcount,
      url: artist.url,
    })) || [];

  if (!artists.length) {
    return new Response(JSON.stringify({ error: "No top artists found" }), {
      status: 404,
    });
  }

  await redis.set(cacheKey, artists, { ex: 60 * 60 * 6 });

  return new Response(JSON.stringify({ country, source: "fresh", artists }), {
    status: 200,
  });
}
