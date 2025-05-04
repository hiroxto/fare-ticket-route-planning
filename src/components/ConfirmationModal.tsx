import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState, useEffect } from "react";
import { useSound } from "@/hooks/useSound";

interface ConfirmationModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
}

export function ConfirmationModal({
    opened,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = "削除",
    cancelButtonText = "キャンセル",
    confirmButtonColor = "red",
}: ConfirmationModalProps) {
    const playSound = useSound('/assets/sounds/maou_se_chime13.mp3');

    useEffect(() => {
        if (opened) {
            playSound();
        }
    }, [opened, playSound]);

    return (
        <Modal opened={opened} onClose={onClose} title={title}>
            <p>{message}</p>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="light" onClick={onClose}>
                    {cancelButtonText}
                </Button>
                <Button variant="filled" color={confirmButtonColor} onClick={onConfirm}>
                    {confirmButtonText}
                </Button>
            </div>
        </Modal>
    );
}

export function useConfirmationModal() {
    const [isOpened, { open, close }] = useDisclosure(false);
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

    const openModal = (onConfirm: () => void) => {
        setOnConfirmCallback(() => onConfirm);
        open();
    };

    const handleConfirm = () => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        close();
    };

    return {
        isOpened,
        openModal,
        closeModal: close,
        handleConfirm,
    };
}
