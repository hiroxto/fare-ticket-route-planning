import { useSound } from "@/hooks/useSound";
import type { SoundType } from "@/hooks/useSound";
import { Button } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";

interface SoundButtonProps extends ButtonProps {
    soundType: SoundType;
    onClick: () => void;
}

export function SoundButton({ soundType, onClick, ...props }: SoundButtonProps) {
    const playSound = useSound(soundType);

    const handleClick = () => {
        playSound();
        onClick();
    };

    return <Button {...props} onClick={handleClick} />;
}
