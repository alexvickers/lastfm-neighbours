export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json(
      { error: "Missing username parameter" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.LASTFM_API_KEY;
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getneighbours&user=${username}&api_key=${API_KEY}&format=json`

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      return Response.json({ error: data.message }, { status: 500 });
    }

    return Response.json(data.neighbours.user);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch neighbours" },
      { status: 500 }
    );
  }
}
