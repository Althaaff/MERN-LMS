import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  console.log("played: ", played);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeOutRef = useRef(null);

  function handleSeekChange(newValue) {
    console.log("new value :", newValue);
    setPlayed(newValue[0]);
    setSeeking(true);
    playerRef.current.seekTo(played);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
  }

  function handlePlayAndPause() {
    setPlaying(!playing);
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayed(state.played);
    }
  }

  function handleRewind() {
    playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 5);
  }

  function handleForward() {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5);
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0]);
  }
  // Handle fullscreen toggle
  const handleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Handle smooth controls transition
  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeOutRef.current);
    controlsTimeOutRef.current = setTimeout(() => setShowControls(false), 3000);
  }

  function handleMouseLeave() {
    clearTimeout(controlsTimeOutRef.current);
    controlsTimeOutRef.current = setTimeout(() => setShowControls(false), 1000);
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    let date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  // one video completed :
  useEffect(() => {
    if (played === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${
        isFullScreen ? "w-screen h-screen" : ""
      }`}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0, cursor: "pointer" }}
      />

      {/* Smoothly appearing/disappearing controls */}
      <div
        className={`absolute bottom-0 left-0 right-0  bg-opacity-75 transform transition-all duration-500 ease-in-out bg-white/30 backdrop-blur-md rounded-lg p-1.5  ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <Slider
          value={[played * 100]}
          max={100}
          step={0.1}
          onValueChange={(value) => handleSeekChange([value[0] / 100])}
          onValueCommit={handleSeekMouseUp}
          className="w-full mb-4"
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-transparent hover:text-primary hover:bg-gray-700 cursor-pointer"
              onClick={handlePlayAndPause}
            >
              {playing ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-transparent hover:text-primary hover:bg-gray-700 cursor-pointer"
              onClick={handleRewind}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-transparent hover:text-primary hover:bg-gray-700 cursor-pointer"
              onClick={handleForward}
            >
              <RotateCw className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-transparent hover:text-primary hover:bg-gray-700 cursor-pointer"
              onClick={handleToggleMute}
            >
              {muted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>

            {/* Volume Slider */}
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => handleVolumeChange([value[0] / 100])}
              className="w-24 cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white">
              {formatTime(played * playerRef?.current?.getDuration() || 0)}{" "}
              <span className="text-gray-600 font-bold">/</span>{" "}
              {formatTime(playerRef?.current?.getDuration() || 0)}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-transparent hover:text-primary hover:bg-gray-700 cursor-pointer"
              onClick={handleFullScreen}
            >
              {isFullScreen ? (
                <Minimize className="h-6 w-6" />
              ) : (
                <Maximize className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
