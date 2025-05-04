import { useRef, useEffect } from 'react';

const audioCache = new Map<string, HTMLAudioElement>();

export const useSound = (soundPath: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioCache.has(soundPath)) {
            const audio = new Audio(soundPath);
            audioCache.set(soundPath, audio);
        }
        audioRef.current = audioCache.get(soundPath) ?? null;
    }, [soundPath]);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    return play;
};
