import { ConfirmationModal, useConfirmationModal } from "@/components/ConfirmationModal";
import { SoundButton } from "@/components/SoundButton";
import { useRouteState } from "@/feature/route-state";
import { Button, Textarea } from "@mantine/core";
import React from "react";

export default function Note() {
    const notes = useRouteState(state => state.notes);
    const setNotes = useRouteState(state => state.setNotes);
    const resetNotes = useRouteState(state => state.resetNotes);
    const {
        isOpened: isOpenedClearNotesModal,
        openModal: openClearNotesModal,
        closeModal: closeClearNotesModal,
        handleConfirm: handleClearNotesConfirm,
    } = useConfirmationModal();

    return (
        <>
            <div className="col-span-10">
                <h2 className="section-title">備考</h2>
                <Textarea
                    placeholder="備考"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-10/12"
                />
            </div>
            <div className="col-span-2">
                <SoundButton
                    variant="filled"
                    color="red"
                    className="button"
                    onClick={() => openClearNotesModal(resetNotes)}
                    soundType="chime"
                >
                    備考クリア
                </SoundButton>

                <ConfirmationModal
                    opened={isOpenedClearNotesModal}
                    onClose={closeClearNotesModal}
                    onConfirm={handleClearNotesConfirm}
                    title="備考のクリア"
                    message="備考をクリアしますか？"
                    confirmButtonText="クリア"
                />
            </div>
        </>
    );
}
