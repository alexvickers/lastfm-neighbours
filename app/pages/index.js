import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);

  const fetchNeighbours = async () => {
    const res = await fetch(`/api/neighbours?username=${username}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Last.fm Neighbours Finder</h1>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Enter Last.fm username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={fetchNeighbours}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Find Neighbours
      </button>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Top Artists</h2>
          <ul className="list-disc ml-5">
            {result.topArtists.map((artist) => (
              <li key={artist.mbid || artist.name}>{artist.name}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-6">Neighbours</h2>
          <ul className="list-disc ml-5">
            {result.neighbours.map((neighbour) => (
              <li key={neighbour.name}>
                <a
                  href={`https://www.last.fm/user/${neighbour.name}`}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {neighbour.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
