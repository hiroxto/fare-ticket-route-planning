import { useSound } from "@/hooks/useSound";
import { Button } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";
import { useMemo } from "react";

type SoundType = "click" | "chime" | "success" | "none";

interface SoundButtonProps extends ButtonProps {
    soundType: SoundType;
    onClick: () => void;
}

const SOUND_PATHS: Record<SoundType, string> = {
    click: "/assets/sounds/maou_se_system40.mp3",
    chime: "/assets/sounds/maou_se_chime13.mp3",
    success: "/assets/sounds/maou_se_system49.mp3",
    none: "",
};

export function SoundButton({ soundType, onClick, ...props }: SoundButtonProps) {
    const soundPath = useMemo(() => SOUND_PATHS[soundType], [soundType]);
    const playSound = useSound(soundPath);

    const handleClick = () => {
        if (soundType !== "none") {
            playSound();
        }
        onClick();
    };

    return <Button {...props} onClick={handleClick} />;
}
