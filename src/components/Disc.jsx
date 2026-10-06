import React from "react";
import { cn } from "@/utils/cn";
const Disc = ({ position, className, label = "", image, classLabel, handle }) => {
    return (
        <div
            style={{ position: "absolute", left: position.x, top: position.y }}
            className={cn(
                "group opacity-0 hover:opacity-100 touch:opacity-60 duration-300 flex items-center justify-center cursor-pointer",
                className,
            )}
            onClick={handle}
        >
            <img src={image} alt="Disc" className="w-full h-auto"/>
            <div
                className={cn(
                    "text-white whitespace-nowrap absolute top-[55.879562043%]",
                    // Trên touch các tên bài hiện cùng lúc nên phải xuống dòng trong phạm vi đĩa
                    "touch:whitespace-normal touch:w-full touch:text-center touch:leading-tight",
                    classLabel,
                )}
            >
                {label}
            </div>
        </div>
    );
};

export default Disc;
