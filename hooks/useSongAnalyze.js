import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import { useState, useEffect } from "react";

function useSongAnalysis() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songAnalysis, setSongAnalysis] = useState(null);

  useEffect(() => {
    const fetchSongAnalysis = async () => {
      if (currentTrackId) {
        const songAnalysis = await fetch(
          `https://api.spotify.com/v1/audio-analysis/${currentTrackId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setSongAnalysis(songAnalysis);
      }
    };
    fetchSongAnalysis();
  }, [spotifyApi, currentTrackId]);

  return songAnalysis;
}

export default useSongAnalysis;
