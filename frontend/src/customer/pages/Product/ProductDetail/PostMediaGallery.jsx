import { ChevronLeft, Pause, Play, Volume2, VolumeX, ZoomIn } from "lucide-react";
import React, { useRef, useState } from "react";

const PostMediaGallery = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [mutedVideos, setMutedVideos] = useState({});
  const [progress, setProgress] = useState({});

  const videoRefs = useRef({});

  const itemsPerPage = 2;
  const totalPages = Math.ceil(media.length / itemsPerPage);

  const currentMedia = media.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  );

  if (!media || media.length === 0) return null;

  // PLAY / PAUSE
  const togglePlay = (idx) => {
    const video = videoRefs.current[idx];

    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayingIndex(idx);
    } else {
      video.pause();
      setPlayingIndex(null);
    }
  };

  // MUTE
  const toggleMute = (idx) => {
    const video = videoRefs.current[idx];

    if (!video) return;

    video.muted = !video.muted;

    setMutedVideos((prev) => ({
      ...prev,
      [idx]: video.muted,
    }));
  };

  // PROGRESS
  const handleTimeUpdate = (idx) => {
    const video = videoRefs.current[idx];

    if (!video) return;

    const value = (video.currentTime / video.duration) * 100;

    setProgress((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  // FULLSCREEN
  const handleZoom = (idx) => {
    const video = videoRefs.current[idx];

    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  return (
    <div className="space-y-6">
      {/* MEDIA */}
      <div className="flex flex-wrap gap-6">
        {currentMedia.map((mediaUrl, idx) => {
          const globalIdx = currentIndex * itemsPerPage + idx;

          const isVideo =
            mediaUrl.match(/\.(mp4|webm|ogg)$/i) || mediaUrl.includes("video");

          return (
            <div
              key={globalIdx}
              className="relative w-60 h-80 rounded-[2.5rem] overflow-hidden bg-black shadow-2xl group"
            >
              {isVideo ? (
                <>
                  {/* VIDEO */}
                  <video
                    ref={(el) => (videoRefs.current[globalIdx] = el)}
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    onTimeUpdate={() => handleTimeUpdate(globalIdx)}
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* CONTROLS */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* PROGRESS */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-white transition-all"
                        style={{
                          width: `${progress[globalIdx] || 0}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      {/* LEFT */}
                      <div className="flex items-center gap-3">
                        {/* PLAY */}
                        <button
                          onClick={() => togglePlay(globalIdx)}
                          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
                        >
                          {playingIndex === globalIdx ? (
                            <Pause size={18} fill="black" />
                          ) : (
                            <Play size={18} fill="black" />
                          )}
                        </button>

                        {/* VOLUME */}
                        <button
                          onClick={() => toggleMute(globalIdx)}
                          className="text-white"
                        >
                          {mutedVideos[globalIdx] ? (
                            <VolumeX size={18} />
                          ) : (
                            <Volume2 size={18} />
                          )}
                        </button>
                      </div>

                      {/* FULLSCREEN */}
                      <button
                        onClick={() => handleZoom(globalIdx)}
                        className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition"
                      >
                        <ZoomIn size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={mediaUrl}
                  alt="Post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          {/* PREV */}
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>

          {/* DOTS */}
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-6 bg-slate-900" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>

          {/* NEXT */}
          <button
            disabled={currentIndex === totalPages - 1}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-30"
          >
            <ChevronLeft size={18} className="rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMediaGallery;
