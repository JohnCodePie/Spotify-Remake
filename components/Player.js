import { useRecoilState } from "recoil";
import { useState, useEffect, useCallback } from "react";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import { debounce, shuffle } from "lodash";
import { translate } from "../lib/time";
import {
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import useSongAnalysis from "../hooks/useSongAnalyze";

const colors = [
  "bg-green-500",
  "bg-blue-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-white",
  "bg-purple-500",
  "bg-lime-900",
  "bg-rose-900",
];

function Player() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();
  const songAnalysis = useSongAnalysis();
  const [color, setColor] = useState("bg-green-200");

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing: " + data.body?.item?.id);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 101) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      console.log("volume changed to:" + volume);
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  const validation = songAnalysis ? Object.keys(songAnalysis).length : 0;

  return (
    <div>
      <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 opacity-75">
        <div className="flex items-center space-x-4">
          <img
            className="hidden md:inline h-10 w-10"
            src={songInfo?.album.images?.[0].url}
          ></img>
          <div>
            <h3>{songInfo?.name}</h3>
            <p>{songInfo?.artists?.[0]?.name}</p>
          </div>
        </div>

        <div className="flex items-center justify-evenly ">
          <SwitchHorizontalIcon className="button" />
          <RewindIcon className="button" />
          {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
          )}
          <FastForwardIcon
            /* onClick={() => {
              console.log(songAnalysis);
            }} */
            className="button"
          />
          <ReplyIcon className="button" />
        </div>

        <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5 ">
          <VolumeDownIcon
            onClick={() => volume > 0 && setVolume(volume - 10)}
            className="button"
          />
          <input
            className="w-14 md:w-28"
            type="range"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            min={0}
            max={100}
          />
          <VolumeUpIcon
            onClick={() => volume < 100 && setVolume(volume + 10)}
            className="button"
          />
        </div>
      </div>
      <div>
        <div className={`md:h-20 sm:h-10 flex flex-row `}>
          {songAnalysis?.sections?.map((section) => {
            const val = Math.round(
              translate(
                Math.round(section.duration),
                0,
                Math.round(songAnalysis.track.duration),
                1,
                100
              )
            );
            return (
              <div
                style={{ width: val + "%" }}
                className={`${shuffle(colors).pop()}`}
              />
            );
          })}
        </div>
        <div>
          <input
            type="range"
            min="1"
            max="100"
            value="20"
            className="flex flex-grow w-full"
            id="myRange"
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
