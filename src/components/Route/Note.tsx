import { useRouteState } from "@/feature/state";
import { Button, Textarea } from "@mantine/core";
import React from "react";

export default function Note() {
    const notes = useRouteState(state => state.notes);
    const setNotes = useRouteState(state => state.setNotes);
    const resetNotes = useRouteState(state => state.resetNotes);

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
                <Button variant="filled" color="red" className="button" onClick={resetNotes}>
                    備考クリア
                </Button>
            </div>
        </>
    );
}
