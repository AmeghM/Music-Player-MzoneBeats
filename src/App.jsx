import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  FaMusic,
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
} from "react-icons/fa";
import { IoMdMusicalNote } from "react-icons/io";

import LiquidEther from "./LiquidEther";

function App() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const audioRef = useRef(null);

  const searchMusic = async () => {
    if (!query.trim()) return;
    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&media=music&limit=20`
    );
    const data = await res.json();
    setSongs(data.results);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlay) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [isPlay, currentSong]);

  const skipNext = () => {
    if (currentIndex < songs.length - 1) {
      const nextSong = songs[currentIndex + 1];
      setCurrentSong(nextSong);
      setCurrentIndex(currentIndex + 1);
      setIsPlay(true);
    }
  };

  const skipPrevious = () => {
    if (currentIndex > 0) {
      const prevSong = songs[currentIndex - 1];
      setCurrentSong(prevSong);
      setCurrentIndex(currentIndex - 1);
      setIsPlay(true);
    }
  };

  const handleSongSelect = (song, index) => {
    if (song.trackId === currentSong?.trackId) {
      setIsPlay(!isPlay);
    } else {
      setCurrentSong(song);
      setCurrentIndex(index);
      setIsPlay(true);
    }
  };

  return (
    <>
      <div className="min-h-screen relative p-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gray-900">
          <LiquidEther
            colors={["#c2f702", "#b8f906", "#fbff00"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div
          className="min-h-screen
         relative z-10 bg-gray-900/60 backdrop-blur-sm text-white p-4 pb-32"
        >
          <div className="flex items-center justify-center mt-3 ">
            <h1 className="text-3xl font-bold  mb-6 flex">
              <span className="me-4 text-[#FFD700] animate-bounce transition">
                <FaMusic />
              </span>
              MzoneBeats
              <span className="ms-3 text-4xl text-[#FFD700] animate-bounce transition">
                <IoMdMusicalNote />
              </span>
            </h1>
          </div>

          <div className="max-w-xl mx-auto flex gap-2 mb-8">
            <input
              type="text"
              placeholder="Search songs, artists..."
              className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              onClick={searchMusic}
              className="px-4 py-3 bg-[#DAA520] hover:bg-[#c48f1c] rounded-lg"
            >
              Search
            </button>
          </div>

          {/* Song Results */}
          <div className="max-w-3xl mx-auto grid gap-4">
            {songs.map((song, index) => (
              <div
                key={song.trackId}
                className={`flex items-center gap-4 p-4 rounded-xl shadow-lg transition duration-300 border-2 
                ${
                  currentSong?.trackId === song.trackId
                    ? "bg-[#B08F3C] border-[#DAA520] scale-[1.02] ring-4 ring-[#FFD700]/50"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700/80 cursor-pointer"
                }`}
                onClick={() => handleSongSelect(song, index)}
              >
                <img
                  src={song.artworkUrl100}
                  alt="cover"
                  className="w-16 h-16 rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{song.trackName}</h2>
                  <p className="text-gray-400 text-sm">{song.artistName}</p>
                </div>
                {currentSong?.trackId === song.trackId && (
                  <div className="text-[#FFD700] text-xl animate-pulse">
                    {isPlay ? <FaPause size={24} /> : <FaPlay size={24} />}
                  </div>
                )}
              </div>
            ))}
          </div>

          {currentSong && (
            <div className="fixed bottom-0 left-0 w-full bg-gray-850 p-4 border-t border-gray-700 bg-[#B08F3C]/60 z-10">
              <div className="max-w-3xl mx-auto flex items-center gap-4">
                <img
                  src={currentSong.artworkUrl100}
                  className="w-16 h-16 rounded-lg"
                  alt=""
                />

                <div className="flex-1">
                  <h2 className="font-semibold">{currentSong.trackName}</h2>
                  <p className="text-gray-400 text-sm">
                    {currentSong.artistName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={skipPrevious}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    disabled={currentIndex === 0}
                  >
                    <FaBackward />
                  </button>

                  <button
                    onClick={() => setIsPlay(!isPlay)}
                    className="px-4 py-2 bg-[#C9A646] hover:bg-[#B08F3C] rounded-lg"
                  >
                    {isPlay ? <FaPause /> : <FaPlay />}
                  </button>

                  <button
                    onClick={skipNext}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    disabled={currentIndex === songs.length - 1}
                  >
                    <FaForward />
                  </button>
                </div>

                <audio ref={audioRef} src={currentSong.previewUrl}></audio>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
