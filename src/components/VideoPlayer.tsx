interface VideoPlayerProps {
  embedUrl: string;
  title: string;
}

const VideoPlayer = ({ embedUrl, title }: VideoPlayerProps) => {
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default VideoPlayer;
