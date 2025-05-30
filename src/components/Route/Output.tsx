import { useRouteState } from "@/feature/route-state";
import { LikeMr52Formatter } from "@/lib/formatter";
import { useMemo } from "react";

export default function Output() {
    const type = useRouteState(state => state.type);
    const month = useRouteState(state => state.month);
    const day = useRouteState(state => state.day);
    const dateOption = useRouteState(state => state.dateOption);
    const departure = useRouteState(state => state.departure);
    const destination = useRouteState(state => state.destination);
    const routes = useRouteState(state => state.routes);
    const notes = useRouteState(state => state.notes);

    const valuedRoutes = useMemo(() => routes.filter(route => route.line.trim() !== ""), [routes]);
    const output = useMemo(() => {
        const header = [
            type,
            dateOption === "use" ? `利用開始日: ${month}月${day}日` : null,
            `区間: ${departure}→${destination}`,
        ]
            .filter(el => el != null)
            .join("\n\n");

        const routesOutput = new LikeMr52Formatter(valuedRoutes).format();
        const footer = notes === "" ? "" : `備考: ${notes.trim()}`;

        return `${header}\n\n${routesOutput}\n\n${footer}`.trim();
    }, [type, month, day, dateOption, departure, destination, valuedRoutes, notes]);

    return (
        <>
            <h2 className="section-title">出力</h2>

            <pre className="bg-gray-100 p-5 rounded-md w-10/12 whitespace-pre">
                <span className="whitespace-pre-wrap">{output}</span>
            </pre>
        </>
    );
}
