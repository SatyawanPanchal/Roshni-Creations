import { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Play } from "lucide-react";

import video1Thumbnail from "../../images/RoshniInMotion/video1Thumbnail.webp";
import video2Thumbnail from "../../images/RoshniInMotion/video2Thumbnail.webp";
import video3Thumbnail from "../../images/RoshniInMotion/video3Thumbnail.webp";
import video4Thumbnail from "../../images/RoshniInMotion/video4Thumbnail.webp";

import video1 from "../../images/RoshniInMotion/video1.mp4";
import video2 from "../../images/RoshniInMotion/video2.mp4";
import video3 from "../../images/RoshniInMotion/video3.mp4";
import video4 from "../../images/RoshniInMotion/video4.mp4";

const videos = [
  {
    id: 1,
    thumbnail: video1Thumbnail,
    videoUrl: video1,
  },
  {
    id: 2,
    thumbnail: video2Thumbnail,
    videoUrl: video2,
  },
  {
    id: 3,
    thumbnail: video3Thumbnail,
    videoUrl: video3,
  },
  {
    id: 4,
    thumbnail: video4Thumbnail,
    videoUrl: video4,
  },
];

const VideoCard = ({ video, onClick }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    videoElement.currentTime = 0;
    videoElement.muted = true;

    videoElement
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  const handleMouseLeave = () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    videoElement.pause();
    videoElement.currentTime = 0;

    setIsPlaying(false);
  };

  return (
    <div
      className="
        tw:group
        tw:relative
        tw:aspect-[3/5]
        tw:cursor-pointer
        tw:overflow-hidden
        tw:rounded-[3px]
        tw:bg-[#e9e9e7]
      "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* ================= VIDEO ================= */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        muted
        loop
        playsInline
        preload="auto"
        className="
          tw:absolute
          tw:inset-0
          tw:h-full
          tw:w-full
          tw:object-cover
        "
      />

      {/* ================= THUMBNAIL ================= */}
      <img
        src={video.thumbnail}
        alt={`Roshni Creations video ${video.id}`}
        className={`
          tw:absolute
          tw:inset-0
          tw:h-full
          tw:w-full
          tw:object-cover
          tw:transition-opacity
          tw:duration-700
          tw:ease-in-out
          ${
            isPlaying
              ? "tw:opacity-0"
              : "tw:opacity-100"
          }
        `}
      />

      {/* ================= PLAY BUTTON ================= */}
      <div
        className={`
          tw:absolute
          tw:left-1/2
          tw:top-1/2
          tw:flex
          tw:-translate-x-1/2
          tw:-translate-y-1/2
          tw:items-center
          tw:justify-center
          tw:transition-opacity
          tw:duration-500
          tw:ease-in-out
          ${
            isPlaying
              ? "tw:opacity-0"
              : "tw:opacity-100"
          }
        `}
      >
        <div
          className="
            tw:flex
            tw:h-12
            tw:w-12
            tw:items-center
            tw:justify-center
            tw:rounded-full
            tw:border
            tw:border-white
            tw:bg-black/10
            tw:backdrop-blur-[2px]
            tw:sm:h-14
            tw:sm:w-14
          "
        >
          <Play
            size={20}
            strokeWidth={1.5}
            fill="white"
            className="tw:ml-0.5 tw:text-white"
          />
        </div>
      </div>
    </div>
  );
};

const RoshniInMotion = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section
      className="
        tw:w-full
        tw:bg-[#fafaf8]
        tw:px-4
        tw:py-8
        tw:sm:px-6
        tw:lg:px-10
        tw:xl:py-20
      "
    >
      {/* ================= HEADING ================= */}
      <div className="tw:mx-auto tw:max-w-3xl tw:text-center">
        <h2
          className="
            tw:font-serif
            tw:text-[38px]
            tw:font-normal
            tw:leading-tight
            tw:text-[#202020]
            tw:sm:text-[44px]
            tw:lg:text-[50px]
          "
        >
          Roshni in Motion
        </h2>

        <p
          className="
            tw:mt-4
            tw:text-[16px]
            tw:font-light
            tw:tracking-wide
            tw:text-[#4d5553]
            tw:sm:text-[18px]
          "
        >
          See how our pieces come to life.
        </p>
      </div>

      {/* ================= VIDEO GRID ================= */}
      <div
        className="
          tw:mx-auto
          tw:mt-12
          tw:grid
          tw:max-w-[1110px]
          tw:grid-cols-3
          tw:gap-3
          tw:sm:gap-5
          tw:md:grid-cols-2
          tw:lg:mt-16
          tw:lg:grid-cols-4
          tw:lg:gap-6
        "
      >
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => setSelectedVideo(video)}
          />
        ))}
      </div>

      {/* ================= VIDEO DIALOG ================= */}
      <Dialog
        visible={!!selectedVideo}
        onHide={() => setSelectedVideo(null)}
        modal
        dismissableMask
        showHeader={false}
        pt={{
          root: {
            className: `
              tw:w-[92vw]
              tw:sm:w-[500px]
            `,
          },
          content: {
            className: `
              tw:bg-black
              tw:p-0
              tw:overflow-hidden
            `,
          },
          mask: {
            className: `
              tw:bg-black/70
              tw:backdrop-blur-sm
            `,
          },
        }}
      >
        {selectedVideo && (
          <video
            src={selectedVideo.videoUrl}
            
            autoPlay
            muted={false}
            playsInline
            className="
              tw:block
              tw:max-h-[80vh]
              tw:w-full
              tw:object-contain
            "
          />
        )}
      </Dialog>
    </section>
  );
};

export default RoshniInMotion;