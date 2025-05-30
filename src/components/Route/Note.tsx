import { useRouteState } from "@/feature/route-state";
import { Textarea } from "@mantine/core";

export default function Note() {
    const notes = useRouteState(state => state.notes);
    const setNotes = useRouteState(state => state.setNotes);

    return (
        <>
            <h2 className="section-title">備考</h2>
            <Textarea placeholder="備考" value={notes} onChange={e => setNotes(e.target.value)} className="w-10/12" />
        </>
    );
}
