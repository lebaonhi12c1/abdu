import React from "react";
import volume from "@/assets/volume/volume.png";
import { cn } from "@/utils/cn";
const VolumeButton = ({ position, className, labelVolume="none", classNameVolume, classNameHitArea, handle }) => {
    return (
        <div
            className={cn(
                "absolute cursor-pointer group  duration-300 opacity-0 hover:opacity-100 touch:opacity-60",
                // Vùng chạm trong suốt mở rộng trên màn cảm ứng (nút thật chỉ vài px)
                "touch:before:absolute touch:before:content-['']",
                className,
                classNameHitArea,
            )}
            style={{ left: position.x, top: position.y }}
            onClick={handle}
        >
            <div className={cn("absolute opacity-0 group-hover:opacity-100 px-2 py-1 bg-black/50 text-white whitespace-nowrap", classNameVolume)}>
                {labelVolume}
            </div>
            {/* Trên iOS, YouTube không đổi được âm lượng bằng code nên nút này không có tác dụng */}
            <img src={volume} alt="Volume" />
        </div>
    );
};

export default VolumeButton;
