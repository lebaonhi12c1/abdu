import React from "react";
import volume from "@/assets/volume/volume.png";
import { cn } from "@/utils/cn";
const VolumeButton = ({ position, className, labelVolume="none", classNameVolume, handle }) => {
    return (
        <div
            className={cn(
                "absolute cursor-pointer group  duration-300 opacity-0 hover:opacity-100",
                className,
            )}
            style={{ left: position.x, top: position.y }}
            onClick={handle}
        >
            <div className={cn("absolute opacity-0 group-hover:opacity-100 px-2 py-1 bg-black/50 text-white whitespace-nowrap", classNameVolume)}>
                {labelVolume}
            </div>
            <img src={volume} alt="Volume" />
        </div>
    );
};

export default VolumeButton;
