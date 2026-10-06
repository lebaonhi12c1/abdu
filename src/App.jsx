import React, { useEffect, useRef, useState } from "react";
import lowQualityPullBackground from "@/assets/low-quality-pull.jpg";
import { pull, pull2, sizes } from "@/assets/bg";
import p2 from "@/assets/post/p2.png";
import p3 from "@/assets/post/p3.png";
import p4 from "@/assets/post/p4.png";
import p1 from "@/assets/post/p1.png";
import p5 from "@/assets/post/p5.png";
import p6 from "@/assets/post/p6.png";
import phone from "@/assets/phone.png";
import screen from "@/assets/screen.png";
import ImageFrame from "@/components/ImageFrame";
import { cn } from "@/utils/cn";
import MusicBoxes from "@/components/MusicPlayer";

const PAN_QUERY = "(orientation: portrait) and (max-width: 767px)";

// Các điểm dừng khi kéo ngang ở chế độ pan. Hai mép scene phải là điểm snap,
// nếu không WebKit sẽ re-snap về Screen mỗi khi layout thay đổi
const SNAP_POINTS = [
    { id: "posts", className: "left-0 snap-start" },
    { id: "screen", className: "left-[45.6%] snap-center" },
    { id: "discs", className: "right-0 snap-end" },
];

const Background = ({ image, className, ...props }) => (
    <picture>
        <source type="image/avif" srcSet={image.avif} sizes={sizes} />
        <source type="image/webp" srcSet={image.webp} sizes={sizes} />
        <img
            src={image.fallback}
            alt=""
            width="2560"
            height="1440"
            decoding="async"
            className={cn("w-full h-auto absolute inset-0", className)}
            {...props}
        />
    </picture>
);

const App = () => {
    const [active, setActive] = useState(false);
    // Tải trước ảnh pull2 sau khi ảnh nền chính xong, để bấm Screen không bị nháy
    const [preloadActive, setPreloadActive] = useState(false);
    const [showPanHint, setShowPanHint] = useState(true);
    const scrollerRef = useRef(null);
    const screenSnapRef = useRef(null);

    // Chế độ pan: mở trang ở giữa scene (khu vực Screen) thay vì mép trái
    useEffect(() => {
        if (!window.matchMedia(PAN_QUERY).matches) return;
        const scroller = scrollerRef.current;
        scroller.scrollLeft =
            screenSnapRef.current.offsetLeft - scroller.clientWidth / 2;
        const timer = setTimeout(() => setShowPanHint(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main
            ref={scrollerRef}
            onTouchStart={() => setShowPanHint(false)}
            className={cn(
                "w-full h-screen supports-[height:100dvh]:h-dvh bg-linear-to-r from-[#30184D] to-[#C10077]",
                "fit:flex fit:items-center fit:justify-center fit:overflow-hidden",
                "pan:overflow-x-auto pan:overflow-y-hidden pan:overscroll-x-contain pan:snap-x pan:snap-proximity",
            )}
        >
            <div
                data-testid="scene"
                className={cn(
                    "@container relative w-full aspect-[16/9] shrink-0",
                    "fit:w-[min(100vw,calc(100dvh*16/9))]",
                    "pan:h-full pan:w-auto",
                )}
            >
                <img
                    src={lowQualityPullBackground}
                    alt=""
                    width="2560"
                    height="1440"
                    className="w-full h-auto"
                />
                <Background
                    image={pull}
                    data-testid="bg"
                    fetchPriority="high"
                    onLoad={() => setPreloadActive(true)}
                />
                {(active || preloadActive) && (
                    <Background
                        image={pull2}
                        fetchPriority="low"
                        className={cn(!active && "invisible")}
                    />
                )}
                {SNAP_POINTS.map((point) => (
                    <div
                        key={point.id}
                        ref={point.id === "screen" ? screenSnapRef : undefined}
                        aria-hidden
                        className={cn("absolute top-0 size-px", point.className)}
                    />
                ))}
                <div
                    className={cn(
                        "absolute w-[18.5546875%] left-[36.3671875%] top-[36.041666666%] flex items-center justify-center text-white font-bold group cursor-pointer duration-300",
                        active ? "opacity-100" : "opacity-0",
                    )}
                    onClick={() => setActive(!active)}
                >
                    <img src={screen} alt="Screen" className="w-full h-auto" />
                    <span className="duration-300 drop-shadow-sm drop-shadow-black/50 tracking-wider absolute rotate-[-8.02deg] left-[32.421052631%] top-[58.305084745%]">
                        Preparing Access...
                    </span>
                </div>

                <div className="absolute w-[10.7421875%] h-[36.875%] left-[23.75%] top-[23.194444444%] flex items-center justify-center rotate-[-8.02deg] text-white font-bold group">
                    <span className="group-hover:opacity-100 opacity-0 touch:opacity-60 duration-300 drop-shadow-sm drop-shadow-black/50 tracking-wider">
                        non-interactive
                    </span>
                </div>
                <ImageFrame
                    position={{ x: "18.4765625%", y: "1.527777777%" }}
                    image={p2}
                    classContainer="origin-left w-[6.7578125%]"
                    link="https://x.com/rozikrypto/status/2028397390567481417?s=20"
                />
                <ImageFrame
                    position={{ x: "12.109375%", y: "1.736111111%" }}
                    image={p1}
                    classContainer="w-[5.859375%]"
                    link="https://x.com/rozikrypto/status/2024106629856403757?s=20"
                />
                <ImageFrame
                    position={{ x: "1.1328125%", y: "6.041666666%" }}
                    image={p3}
                    classContainer="w-[11.0546875%]"
                    link="https://x.com/rozikrypto/status/2020508145962095094?s=20"
                />
                <ImageFrame
                    position={{ x: "0.0390625%", y: "27.638888888%" }}
                    image={p4}
                    classContainer="w-[14.53125%]"
                    link="https://x.com/rozikrypto/status/2021569917347057948?s=20"
                />
                <ImageFrame
                    position={{ x: "14.921875%", y: "29.236111111%" }}
                    image={p5}
                    classContainer="w-[7.7734375%]"
                    link="https://x.com/rozikrypto/status/2037514981348868462?s=20"
                />
                <ImageFrame
                    position={{ x: "13.3984375%", y: "14.236111111%" }}
                    image={p6}
                    classContainer="w-[11.5234375%] origin-bottom-right"
                    link="https://x.com/rozikrypto/status/2040054903142592742?s=20"
                />
                <ImageFrame
                    position={{ x: "16.484375%", y: "57.708333333%" }}
                    image={phone}
                    labelButton="SOCIAL"
                    classButton="rotate-[-10deg]"
                    classContainer="w-[5.703125%] hover:scale-105 origin-bottom"
                    link="https://link.me/rozikcrypto"
                />
                <MusicBoxes />
            </div>
            <div
                aria-hidden
                className={cn(
                    "hidden pan:block fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm whitespace-nowrap pointer-events-none transition-opacity duration-500",
                    !showPanHint && "opacity-0",
                )}
            >
                ← swipe to explore →
            </div>
        </main>
    );
};

export default App;
