import { useRouteState } from "@/feature/route-state";
import { useSavedRouteState } from "@/feature/saved-route";
import { isTicketType } from "@/lib/utils";
import { Button, Input, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import React, { useState } from "react";
import type { TicketType } from "~/types";

export default function Setting() {
    const type = useRouteState(state => state.type);
    const month = useRouteState(state => state.month);
    const day = useRouteState(state => state.day);
    const dateOption = useRouteState(state => state.dateOption);
    const departure = useRouteState(state => state.departure);
    const destination = useRouteState(state => state.destination);
    const routes = useRouteState(state => state.routes);
    const notes = useRouteState(state => state.notes);
    const setType = useRouteState(state => state.setType);
    const resetType = useRouteState(state => state.resetType);
    const setMonth = useRouteState(state => state.setMonth);
    const setDay = useRouteState(state => state.setDay);
    const setDateWithIndex = useRouteState(state => state.setDateWithIndex);
    const useDate = useRouteState(state => state.useDate);
    const skipDate = useRouteState(state => state.skipDate);
    const setDeparture = useRouteState(state => state.setDeparture);
    const setDestination = useRouteState(state => state.setDestination);
    const reverse = useRouteState(state => state.reverse);
    const resetStations = useRouteState(state => state.resetStations);
    const savedRoutes = useSavedRouteState(state => state.routes);
    const [saveToID, setSaveToID] = useState<string | null>(null);
    const saveRoute = useSavedRouteState(state => state.saveRoute);
    const updateRoute = useSavedRouteState(state => state.updateRoute);
    const ticketTypes: TicketType[] = ["片道乗車券", "往復乗車券", "連続乗車券", "別線往復乗車券"];
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <div className="col-span-10">
                <h2 className="section-title">設定</h2>

                <div className="grid grid-cols-12">
                    <div className="col-span-3">
                        <Select
                            label="券種"
                            placeholder="券種"
                            className="w-3/4"
                            data={ticketTypes}
                            value={type}
                            onChange={value => {
                                if (value === null || !isTicketType(value)) {
                                    return;
                                }

                                setType(value);
                            }}
                        />
                    </div>
                    <div className="col-span-3">
                        <div className="grid grid-cols-2 w-3/4">
                            <div className="col-span-1">
                                <Input.Wrapper label="利用開始月">
                                    <Input placeholder="月" value={month} onChange={e => setMonth(e.target.value)} />
                                </Input.Wrapper>
                            </div>
                            <div className="col-span-1">
                                <Input.Wrapper label="利用開始日">
                                    <Input placeholder="日" value={day} onChange={e => setDay(e.target.value)} />
                                </Input.Wrapper>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3">
                        <Input.Wrapper label="発駅" className="w-3/4">
                            <Input placeholder="発駅" value={departure} onChange={e => setDeparture(e.target.value)} />
                        </Input.Wrapper>
                    </div>
                    <div className="col-span-3">
                        <Input.Wrapper label="着駅" className="w-3/4">
                            <Input
                                placeholder="着駅"
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                            />
                        </Input.Wrapper>
                    </div>
                </div>
            </div>
            <div className="col-span-2">
                <Button variant="filled" color="gray" className="button" onClick={() => setDateWithIndex(0)}>
                    本日
                </Button>
                <Button variant="filled" color="gray" className="button" onClick={() => setDateWithIndex(1)}>
                    明日
                </Button>
                <Button variant="filled" color="gray" className="button" onClick={() => setDateWithIndex(2)}>
                    明後日
                </Button>
                <Button variant="filled" color="gray" className="button" onClick={useDate}>
                    利用日表示
                </Button>
                <Button variant="filled" color="gray" className="button" onClick={skipDate}>
                    利用日省略
                </Button>
                <Button variant="filled" color="gray" className="button" onClick={reverse}>
                    発着逆転
                </Button>
                <Button
                    variant="filled"
                    color="red"
                    className="button"
                    onClick={() => {
                        resetType();
                        useDate();
                        resetStations();
                    }}
                >
                    設定クリア
                </Button>
                <Button variant="filled" color="blue" className="button" component={Link} href="/states">
                    保存済み経路
                </Button>
                <Button variant="filled" color="blue" className="button" onClick={open}>
                    保存・更新
                </Button>
                <Modal opened={opened} onClose={close} title="保存・更新">
                    <Button
                        variant="filled"
                        color="blue"
                        className="button"
                        onClick={() => {
                            saveRoute({
                                type: type,
                                month: month,
                                day: day,
                                dateOption: dateOption,
                                departure: departure,
                                via: "", // 使っていないので空文字列で保存する
                                destination: destination,
                                routes: routes,
                                routes2: [], // 使っていないので空配列で保存する
                                notes: notes,
                            });
                            setSaveToID(null);
                            close();
                        }}
                    >
                        新規保存
                    </Button>

                    <Select
                        label="更新先を選択"
                        placeholder="更新先を選択"
                        data={savedRoutes.map(route => ({
                            value: route.id,
                            label: `${route.route.departure} → ${route.route.destination} / ID: ${route.id}`,
                        }))}
                        value={saveToID}
                        onChange={value => setSaveToID(value)}
                    />
                    <Button
                        variant="filled"
                        color="blue"
                        className="button"
                        disabled={saveToID == null}
                        onClick={() => {
                            if (saveToID == null) {
                                return;
                            }

                            updateRoute(saveToID, {
                                type: type,
                                month: month,
                                day: day,
                                dateOption: dateOption,
                                departure: departure,
                                destination: destination,
                                routes: routes,
                                notes: notes,
                            });
                            close();
                        }}
                    >
                        更新
                    </Button>
                </Modal>
            </div>
        </>
    );
}
