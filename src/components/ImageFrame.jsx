import React from "react";
import { cn } from "@/utils/cn";
const ImageFrame = ({
    position = { x: 0, y: 0 },
    labelButton = "View",
    image,
    link,
    classContainer,
    classImage,
    classButton,
}) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "absolute flex items-center justify-center w-fit h-fit group hover:scale-110 transition-transform duration-300 hover:brightness-110 opacity-100 hover:opacity-100",
                classContainer,
            )}
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            <img src={image} className={cn("w-full h-auto", classImage)} />
            <div
                className={cn(
                    "absolute opacity-0 group-hover:opacity-100 px-2 py-1 bg-black/50 text-white whitespace-nowrap",
                    classButton,
                )}
            >
                {labelButton}
            </div>
        </a>
    );
};

export default ImageFrame;
