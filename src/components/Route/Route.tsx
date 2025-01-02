import { useRouteState } from "@/feature/route-state";
import { Button, CloseButton, Input } from "@mantine/core";
import type React from "react";

export default function Route() {
    const routes = useRouteState(state => state.routes);
    const addRoute = useRouteState(state => state.addRoute);
    const updateLine = useRouteState(state => state.updateLine);
    const updateStation = useRouteState(state => state.updateStation);
    const deleteRoute = useRouteState(state => state.deleteRoute);
    const deleteEmptyRoutes = useRouteState(state => state.deleteEmptyRoutes);
    const deleteAllRoutes = useRouteState(state => state.deleteAllRoutes);

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

    return (
        <>
            <div className="col-span-10">
                <h2 className="section-title">経路</h2>
                {routes.map((route, index) => {
                    return (
                        <div className="grid grid-cols-12" key={route.id}>
                            <div className="col-span-1">
                                <p>経路{index + 1}</p>
                            </div>
                            <div className="col-span-5">
                                <Input.Wrapper label="線区" className="w-3/4">
                                    <Input
                                        placeholder="線区"
                                        value={route.line}
                                        onChange={e => updateLine(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                    />
                                </Input.Wrapper>
                            </div>
                            <div className="col-span-5">
                                <Input.Wrapper label="接続駅" className="w-3/4">
                                    <Input
                                        placeholder="接続駅"
                                        value={route.station}
                                        onChange={e => updateStation(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                    />
                                </Input.Wrapper>
                            </div>
                            <div className="col-span-1">
                                <CloseButton onClick={() => deleteRoute(index)} tabIndex={-1} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="col-span-2">
                <Button variant="filled" color="gray" className="button" onClick={() => addRoute(-1)}>
                    経路追加
                </Button>
                <Button variant="light" color="red" className="button" onClick={deleteEmptyRoutes}>
                    空経路クリア
                </Button>
                <Button variant="filled" color="red" className="button" onClick={deleteAllRoutes}>
                    全経路クリア
                </Button>
                <p className="text-base">
                    Tips: 任意の経路でShift+Enterを押すと下に経路追加，最後の経路でTabを押すと最後に経路追加
                </p>
            </div>
        </>
    );
}
