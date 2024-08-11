import { createContext, useEffect, useRef, useState } from "react";
import axios from 'axios';


export const playerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const url = 'http://localhost:4000';

  const [songsData, setSongData] = useState([]);
  const [albumsData, setAlbumData] = useState([]);
  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(0.5); // Initial volume (1 = 100%)
  const [muted, setMuted] = useState(false); // Mute status
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

 
  const increaseVolume = () => {
    if (volume < 1) {
      const newVolume = Math.min(volume + 0.1, 1);
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const decreaseVolume = () => {
    if (volume > 0) {
      const newVolume = Math.max(volume - 0.1, 0);
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const toggleMute = () => {
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    const selectedTrack = songsData.find((item) => item._id === id);
    if (selectedTrack) {
      setTrack(selectedTrack);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const previous = async () => {
    const currentIndex = songsData.findIndex((item) => item._id === track._id);
    if (currentIndex > 0) {
      const previousTrack = songsData[currentIndex - 1];
      setTrack(previousTrack);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const next = async () => {
    const currentIndex = songsData.findIndex((item) => item._id === track._id);
    if (currentIndex < songsData.length - 1) {
      const nextTrack = songsData[currentIndex + 1];
      setTrack(nextTrack);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const seekSong = async (e) => {
    audioRef.current.currentTime = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
  };

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumsData,
    volume,
    muted,
    increaseVolume,
    decreaseVolume,
    toggleMute,setVolume
  };

  const getSongData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongData(response.data.songs);
      setTrack(response.data.songs[0]); // Set initial track
    } catch (error) {
      console.error(error);
    }
  };

  const getAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumData(response.data.albums);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    audioRef.current.ontimeupdate = () => {
      seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + '%';
      setTime({
        currentTime: {
          second: Math.floor(audioRef.current.currentTime % 60),
          minute: Math.floor(audioRef.current.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(audioRef.current.duration % 60),
          minute: Math.floor(audioRef.current.duration / 60),
        },
      });
    };
  }, []);

  useEffect(() => {
    getAlbumData();
    getSongData();
  }, []);

  return (
    <playerContext.Provider value={contextValue}>
      <audio ref={audioRef} />
      {props.children}
    </playerContext.Provider>
  );
};

export default PlayerContextProvider;
