import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { playerContext } from "../context/PlayerContext";

const Player = () => {
  const {
    track,
    seekBar,
    seekBg,
    play,
    pause,
    playStatus,
    time,
    previous,
    next,
    seekSong,
    volume,
    setVolume,
    toggleMute,
    muted,
    audioRef,
  } = useContext(playerContext);

  const handleVolume = (value) => {
    
    setVolume(value);
    audioRef.current.volume = value;

    
    if (value === 0) {
      audioRef.current.muted = true;
    } else {
      audioRef.current.muted = false;
    }
  };

  const handleMute = () => {
    audioRef.current.muted = !audioRef.current.muted;
    toggleMute();
  };

  return track ? (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
      <div className="hidden lg:flex items-center gap-4">
        <img src={track.image} className="w-12" alt="" />
        <div>
          <p>{track.name}</p>
          <p>{track.desc.slice(0, 12)}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img
            src={assets.shuffle_icon}
            className="w-3 cursor-pointer"
            alt=""
          />
          <img
            onClick={previous}
            src={assets.prev_icon}
            className="w-3 cursor-pointer"
            alt=""
          />
          {playStatus ? (
  <img onClick={pause} src={assets.pause_icon} className="w-3 cursor-pointer" alt="" />
) : (
  <img onClick={play} src={assets.play_icon} className="w-3 cursor-pointer" alt="" />
)}
          <img
            onClick={next}
            src={assets.next_icon}
            className="w-3 cursor-pointer"
            alt=""
          />
          <img src={assets.loop_icon} className="w-3 cursor-pointer" alt="" />
        </div>
        <div className="flex items-center gap-5">
          <p>
            {time.currentTime.minute}:{time.currentTime.second}
          </p>
          <div
            onClick={seekSong}
            ref={seekBg}
            className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
          >
            <hr
              ref={seekBar}
              className="h-1 border-none w-0 bg-green-800 rounded-full "
            />
          </div>
          <p>
            {time.totalTime.minute}:{time.totalTime.second}
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-2 opacity-72">
        <img src={assets.plays_icon} className="w-4" alt="" />
        <img src={assets.mic_icon} className="w-4" alt="" />
        <img src={assets.queue_icon} className="w-4" alt="" />
        <img
          src={muted?assets.mute:assets.speaker_icon}
          className="w-4 cursor-pointer"
          alt=""
          onClick={handleMute}
        />
        <input
          type="range"
          id="volume"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolume(parseFloat(e.target.value))}
          className="w-20 bg-slate-50 h-1 rounded"
        />
        <img src={assets.mini_player_icon} className="w-4" alt="" />
        <img src={assets.zoom_icon} className="w-4" alt="" />
      </div>
    </div>
  ) : null;
};

export default Player;
