import { useRouteState } from "@/feature/route-state";
import { DefaultFormatter, LikeMr52Formatter } from "@/lib/formatter";
import { CopyButton, Select } from "@mantine/core";
import { useMemo, useState } from "react";
import type { Formatter, Route } from "~/types";
import { SoundButton } from "@/components/SoundButton";

interface FormatterSet {
    name: string;
    value: string;
    create: (routes: Route[]) => Formatter;
}

export default function Output() {
    const type = useRouteState(state => state.type);
    const month = useRouteState(state => state.month);
    const day = useRouteState(state => state.day);
    const dateOption = useRouteState(state => state.dateOption);
    const departure = useRouteState(state => state.departure);
    const destination = useRouteState(state => state.destination);
    const routes = useRouteState(state => state.routes);
    const notes = useRouteState(state => state.notes);

    const [usingFormatter, setUsingFormatter] = useState<string | null>("default");
    const [formatterSets] = useState<FormatterSet[]>([
        {
            name: "デフォルト",
            value: "default",
            create: routes => new DefaultFormatter(routes),
        },
        {
            name: "MR52風",
            value: "mr52",
            create: routes => new LikeMr52Formatter(routes),
        },
    ]);
    const valuedRoutes = useMemo(() => routes.filter(route => route.line.trim() !== ""), [routes]);
    const output = useMemo(() => {
        const header = [
            type,
            dateOption === "use" ? `利用開始日: ${month}月${day}日` : null,
            `区間: ${departure}→${destination}`,
        ]
            .filter(el => el != null)
            .join("\n\n");

        const formatter = formatterSets.find(set => set.value === usingFormatter);
        const routesOutput = formatter ? formatter.create(valuedRoutes).format() : "";
        const footer = notes === "" ? "" : `備考: ${notes.trim()}`;

        return `${header}\n\n${routesOutput}\n\n${footer}`.trim();
    }, [type, month, day, dateOption, departure, destination, valuedRoutes, notes, usingFormatter, formatterSets]);

    return (
        <>
            <div className="col-span-10">
                <h2 className="section-title">出力</h2>

                <pre className="bg-gray-100 p-5 rounded-md w-10/12 whitespace-pre">
                    <span className="whitespace-pre-wrap">{output}</span>
                </pre>
            </div>
            <div className="col-span-2">
                <CopyButton value={output}>
                    {({ copied, copy }) => (
                        <SoundButton
                            variant="filled"
                            color={copied ? "blue" : "gray"}
                            onClick={copy}
                            className="button"
                            soundType="success"
                        >
                            {copied ? "コピー済み" : "コピー"}
                        </SoundButton>
                    )}
                </CopyButton>
                <Select
                    variant="filled"
                    color="gray"
                    label="Format"
                    className="w-1/2"
                    allowDeselect={false}
                    value={usingFormatter}
                    onChange={value => setUsingFormatter(value)}
                    data={formatterSets.map(set => ({ value: set.value, label: set.name }))}
                ></Select>
            </div>
        </>
    );
}
