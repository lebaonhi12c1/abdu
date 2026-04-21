import React, { useState, useRef } from "react";
import YouTube from "react-youtube";
import VolumeButton from "@/components/Volume";
import Disc from "@/components/Disc";
import d1 from "@/assets/disc/d1.png";
import d2 from "@/assets/disc/d2.png";
import d3 from "@/assets/disc/d3.png";
import { cn } from "@/utils/cn";
const MusicPlayer = () => {
    const [currentPlaying, setCurrentPlaying] = useState(null); // ID của bài đang phát
    const [volume, setVolume] = useState(70);
    const [showVolumePopup, setShowVolumePopup] = useState(false); // Trạng thái popup
    const playerRef = useRef(null);

    // Danh sách 3 bài nhạc
    const songs = [
        {
            id: 1,
            title: `"Pyar"`,
            videoId: "pRsXwxQlMvY",
            src: d1,
            position: { x: "71.71875%", y: "1.111111111%" },
            classLabel: "rotate-2 top-[55.879562043%]",
            className: "w-[9.2578125%]",
        },
        {
            id: 2,
            title: `"Love you no more"`,
            videoId: "XQCTUD9yJlU",
            src: d2,
            position: { x: "80.9765625%", y: "1.111111111%" },
            classLabel: "rotate-[5.02deg] top-[60.03649635%]",
            className: "w-[9.0625%]",
        },
        {
            id: 3,
            title: `"Chota Bhaijaan"`,
            videoId: "7ZBQgV8Pctc",
            src: d3,
            position: { x: "90.0390625%", y: "1.111111111%" },
            classLabel: "rotate-[5.02deg] top-[65.018315018%]",
            className: "",
        },
    ];

    const opts = {
        height: "1",
        width: "1",
        playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            fs: 0,
            iv_load_policy: 3,
            disablekb: 1,
        },
    };

    const onReady = (event) => {
        playerRef.current = event.target;
        event.target.setVolume(volume);
    };

    // Phát hoặc tạm dừng một bài hát
    const toggleSong = (videoId) => {
        if (!playerRef.current) return;

        // Nếu đang phát bài này → tạm dừng
        if (currentPlaying === videoId) {
            playerRef.current.pauseVideo();
            setCurrentPlaying(null);
        }
        // Nếu phát bài khác hoặc chưa phát gì → phát bài mới
        else {
            playerRef.current.loadVideoById(videoId);
            playerRef.current.playVideo();
            setCurrentPlaying(videoId);
        }
    };

    // Tăng âm lượng
    // const increaseVolume = () => {
    //     if (!playerRef.current) return;
    //     let newVol = volume + 10;
    //     if (newVol > 100) newVol = 100;
    //     playerRef.current.setVolume(newVol);
    //     setVolume(newVol);
    // };

    // // Giảm âm lượng
    // const decreaseVolume = () => {
    //     if (!playerRef.current) return;
    //     let newVol = volume - 10;
    //     if (newVol < 0) newVol = 0;
    //     playerRef.current.setVolume(newVol);
    //     setVolume(newVol);
    // };

    // Điều chỉnh volume và mở popup
    const changeVolume = (amount) => {
        if (!playerRef.current) return;
        let newVol = volume + amount;
        if (newVol > 100) newVol = 100;
        if (newVol < 0) newVol = 0;

        playerRef.current.setVolume(newVol);
        setVolume(newVol);
        setShowVolumePopup(true); // Mở popup

        // Tự động đóng popup sau 1.5 giây
        setTimeout(() => setShowVolumePopup(false), 1500);
    };

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                }}
            >
                <YouTube
                    videoId={songs[0].videoId} // VideoId ban đầu (không quan trọng)
                    opts={opts}
                    onReady={onReady}
                />
            </div>
            {showVolumePopup && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.85)",
                        color: "white",
                        padding: "30px 50px",
                        borderRadius: "16px",
                        fontSize: "28px",
                        fontWeight: "bold",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        zIndex: 1000,
                        textAlign: "center",
                        minWidth: "200px",
                    }}
                >
                    Volume: {volume}%
                </div>
            )}
            {/* Danh sách 3 nút nhạc */}
            {songs.map((song) => (
                <div key={song.videoId}>
                    <Disc
                        position={{ x: song.position.x, y: song.position.y }}
                        className={cn(
                            song.className,
                            currentPlaying === song.videoId && "opacity-100",
                        )}
                        classLabel={song.classLabel}
                        label={song.title}
                        image={song.src}
                        handle={() => toggleSong(song.videoId)}
                    />
                </div>
            ))}
            <VolumeButton
                position={{ x: "11.9078125%", y: "71.893055555%" }}
                className="w-[0.54244358%]"
                labelVolume="volume -"
                classNameVolume="right-full bottom-full rotate-[-15deg]"
                handle={() => changeVolume(-10)}
            />
            <VolumeButton
                position={{ x: "12.728125%", y: "71.545833333%" }}
                className="w-[0.54244358%]"
                labelVolume="volume +"
                classNameVolume="left-full bottom-[265%] rotate-[-15deg]"
                handle={() => changeVolume(10)}
            />
        </>
    );
};

export default MusicPlayer;
