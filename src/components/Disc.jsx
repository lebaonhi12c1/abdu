import React from "react";
import { cn } from "@/utils/cn";
const Disc = ({ position, className, label = "", image, classLabel, handle }) => {
    return (
        <div
            style={{ position: "absolute", left: position.x, top: position.y }}
            className={cn(
                "group opacity-0 hover:opacity-100 duration-300 flex items-center justify-center cursor-pointer",
                className,
            )}
            onClick={handle}
        >
            <img src={image} alt="Disc" className="w-full h-auto"/>
            <div
                className={cn(
                    "text-white whitespace-nowrap absolute top-[55.879562043%]",
                    classLabel,
                )}
            >
                {label}
            </div>
        </div>
    );
};

export default Disc;
