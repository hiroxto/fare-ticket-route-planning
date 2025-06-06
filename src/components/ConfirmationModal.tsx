import { SoundButton } from "@/components/SoundButton";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

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
    return (
        <Modal opened={opened} onClose={onClose} title={title}>
            <p>{message}</p>
            <div className="flex justify-end gap-2 mt-4">
                <SoundButton variant="light" onClick={onClose} soundType="click">
                    {cancelButtonText}
                </SoundButton>
                <SoundButton variant="filled" color={confirmButtonColor} onClick={onConfirm} soundType="click">
                    {confirmButtonText}
                </SoundButton>
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
