import videojs from "video.js";
import "video.js/dist/video-js.css";

function ReedVideoJS({ src }: { src: string }) {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-big-play-centered");
            videoRef.current?.appendChild(videoElement);

            const player = (playerRef.current = videojs(videoElement, {
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                liveui: true,
                sources: [{ src, type: "application/x-mpegURL"}]
            }));

            player.on('ready', () => {
                console.log("Uplink = 200 OK");
            });
        } else {
            
            const player = playerRef.current;
            player.src({ src, type: "application/x-mpegURL"});
        }
    }, [src]);
    
    useEffect(() => {
        return () => {
            const player = playerRef.current;
            if (player && !player.isDisposed()) {
                player.dispose(); 
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div data-vjs-player style={{ width: "100%", height: "100%" }}>
            <div ref={videoRef} />
        </div>
    );
}