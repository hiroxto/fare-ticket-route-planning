import { useRef } from "react";

export const useSound = (soundPath: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const play = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(soundPath);
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    };

    return play;
};
