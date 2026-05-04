import React, { useState } from "react";
import pullBackground from "@/assets/pull.png";
import pullBackground2 from "@/assets/pull2.png";
import lowQualityPullBackground from "@/assets/low-quality-pull.png";
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
const App = () => {
    const [active, setActive] = useState(false);
    return (
        <div className="w-full bg-linear-to-r from-[#30184D] to-[#C10077] h-screen">
            <div className="w-fit h-fit relative">
                <img
                    src={lowQualityPullBackground}
                    alt=""
                    className="w-full h-auto"
                />
                <img
                    src={pullBackground}
                    alt=""
                    className="w-full h-auto absolute inset-0"
                />
                {active && (
                    <img
                        src={pullBackground2}
                        alt=""
                        className="w-full h-auto absolute inset-0"
                    />
                )}
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
                    <span className="group-hover:opacity-100 opacity-0 duration-300 drop-shadow-sm drop-shadow-black/50 tracking-wider">
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
                    classButton="rotate-[-10deg] text-[14px]"
                    classContainer="w-[5.703125%] hover:scale-105 origin-bottom"
                    link="https://link.me/rozikcrypto"
                />
                <MusicBoxes />
            </div>
        </div>
    );
};

export default App;
