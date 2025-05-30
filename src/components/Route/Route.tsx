import { useInputSettingStore } from "@/feature/input-setting";
import { useRouteState } from "@/feature/route-state";
import { lineToStations, stationToLines } from "@/lib/route-complete";
import { Autocomplete, CloseButton, Input } from "@mantine/core";
import type React from "react";

export default function Route() {
    const routes = useRouteState(state => state.routes);
    const addRoute = useRouteState(state => state.addRoute);
    const updateLine = useRouteState(state => state.updateLine);
    const updateStation = useRouteState(state => state.updateStation);
    const deleteRoute = useRouteState(state => state.deleteRoute);
    const departure = useRouteState(state => state.departure);
    const destination = useRouteState(state => state.destination);
    const useComplete = useInputSettingStore(state => state.useComplete);

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // 任意の行でShift+Enterを押した場合は下に経路追加
        if (e.key === "Enter" && e.shiftKey) {
            addRoute(index);
        }

        // 最後の行でTabを押した場合は最後に経路追加
        // ただし，Shiftが押されている場合は追加しない
        if (e.key === "Tab" && !e.shiftKey && index === routes.length - 1) {
            addRoute(-1);
        }
    };
    const getLineCompletes = (index: number) => {
        if (index === 0) {
            return stationToLines.get(departure) ?? lineToStations.keys().toArray();
        }

        const lines = stationToLines.get(routes[index - 1].station) ?? [];
        const prevLine = routes[index - 1].line;

        return lines.filter(s => s !== prevLine);
    };
    const getStationCompletes = (index: number) => {
        const stations = lineToStations.get(routes[index].line) ?? [];
        const excludeStation = index === 0 ? departure : routes[index - 1].station;

        return stations.filter(s => s !== excludeStation);
    };
    const getStationError = (index: number, station: string) => {
        const trimmedStation = station.trim();
        if (trimmedStation === "") return null;

        if (trimmedStation === departure && trimmedStation === destination) {
            return "発着駅と重複";
        }

        if (trimmedStation === departure) {
            return "発駅と重複";
        }

        if (trimmedStation === destination) {
            return "着駅と重複";
        }

        return routes.some((route, idx) => idx !== index && route.station.trim() === trimmedStation)
            ? "経路内重複"
            : null;
    };

    return (
        <>
            <h2 className="section-title">経路</h2>
            {routes.map((route, index) => {
                const stationError = getStationError(index, route.station);

                return (
                    <div className="grid grid-cols-12" key={route.id}>
                        <div className="col-span-1">
                            <p>経路{index + 1}</p>
                        </div>
                        <div className="col-span-5">
                            {useComplete && (
                                <Autocomplete
                                    label="路線"
                                    placeholder="路線"
                                    className="w-3/4"
                                    value={route.line}
                                    data={getLineCompletes(index)}
                                    onChange={e => updateLine(index, e)}
                                    onKeyDown={e => handleKeyDown(index, e)}
                                />
                            )}
                            {!useComplete && (
                                <Input.Wrapper label="路線" className="w-3/4">
                                    <Input
                                        placeholder="路線"
                                        value={route.line}
                                        onChange={e => updateLine(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                    />
                                </Input.Wrapper>
                            )}
                        </div>
                        <div className="col-span-5">
                            {useComplete && (
                                <Autocomplete
                                    label="接続駅"
                                    placeholder="接続駅"
                                    className="w-3/4"
                                    value={route.station}
                                    data={getStationCompletes(index)}
                                    error={stationError}
                                    onChange={e => {
                                        updateStation(index, e);
                                        if (e.trim() !== "" && index === routes.length - 1) {
                                            addRoute(-1);
                                        }
                                    }}
                                    onKeyDown={e => handleKeyDown(index, e)}
                                />
                            )}
                            {!useComplete && (
                                <Input.Wrapper label="接続駅" className="w-3/4" error={stationError}>
                                    <Input
                                        placeholder="接続駅"
                                        value={route.station}
                                        error={stationError !== null}
                                        onChange={e => updateStation(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                    />
                                </Input.Wrapper>
                            )}
                        </div>
                        <div className="col-span-1">
                            <CloseButton onClick={() => deleteRoute(index)} tabIndex={-1} />
                        </div>
                    </div>
                );
            })}
        </>
    );
}
