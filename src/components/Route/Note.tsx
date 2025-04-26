import { useRouteState } from "@/feature/route-state";
import { Button, Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

export default function Note() {
    const notes = useRouteState(state => state.notes);
    const setNotes = useRouteState(state => state.setNotes);
    const resetNotes = useRouteState(state => state.resetNotes);
    const [isOpenedClearNotesModal, { open: openClearNotesModal, close: closeClearNotesModal }] = useDisclosure(false);

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
                <Button variant="filled" color="red" className="button" onClick={openClearNotesModal}>
                    備考クリア
                </Button>

                <Modal opened={isOpenedClearNotesModal} onClose={closeClearNotesModal} title="備考のクリア">
                    <p>備考をクリアしますか？</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="light" onClick={closeClearNotesModal}>
                            キャンセル
                        </Button>
                        <Button
                            variant="filled"
                            color="red"
                            onClick={() => {
                                resetNotes();
                                closeClearNotesModal();
                            }}
                        >
                            クリア
                        </Button>
                    </div>
                </Modal>
            </div>
        </>
    );
}
