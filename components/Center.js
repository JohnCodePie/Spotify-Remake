import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession, signOut } from "next-auth/react";
import { shuffle } from "lodash";
import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtoms";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

export const colors = [
  "from-red-500",
  "from-green-500",
  "from-blue-500",
  "from-pink-500",
  "from-yellow-500",
  "from-purple-500",
  "from-orange-500",
  "from-emerald-500",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState("from-red-500");
  const currentPlaylistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [currentPlaylistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(currentPlaylistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((error) => console.log("Something went wrong! ", error));
  }, [currentPlaylistId, spotifyApi]);

  return (
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide ">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
          onClick={() => signOut()}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          ></img>
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-9 `}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
        ></img>
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
