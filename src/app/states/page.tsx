"use client";

import { useRouteState } from "@/feature/route-state";
import { type RouteState, useSavedRouteState } from "@/feature/saved-route";
import { LikeMr52Formatter } from "@/lib/formatter";
import { Button, Modal, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

export default function Home() {
    const router = useRouter();
    const routes = useSavedRouteState(state => state.routes);
    const deleteRoute = useSavedRouteState(state => state.deleteRoute);
    const reconstruct = useRouteState(state => state.reconstruct);
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteState | null>(null);
    const output = useMemo<string>(() => {
        if (selectedRoute == null) {
            return "";
        }

        const formatter = new LikeMr52Formatter(selectedRoute.routes);
        const routesOutput = formatter.format();

        return `${selectedRoute.departure} → ${selectedRoute.destination}\n\n${routesOutput}`.trim();
    }, [selectedRoute]);
    const callState = (state: RouteState) => {
        reconstruct(state);
        router.push("/");
    };

    return (
        <div className="app">
            <div className="container">
                <div className="title-group">
                    <h1 className="title">保存済み経路</h1>
                    <p className="description">保存した経路の一覧と操作</p>
                    <Button variant="filled" color="blue" className="button" component={Link} href="/">
                        入力画面
                    </Button>
                </div>

                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>保存日時</Table.Th>
                            <Table.Th>発駅</Table.Th>
                            <Table.Th>着駅</Table.Th>
                            <Table.Th>経路参照</Table.Th>
                            <Table.Th>備考</Table.Th>
                            <Table.Th>操作</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {routes.map(route => {
                            return (
                                <Table.Tr key={route.id}>
                                    <Table.Td>{route.id}</Table.Td>
                                    <Table.Td>
                                        {new Date(route.createdAtTs).toLocaleDateString("ja-JP", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            timeZone: "Asia/Tokyo",
                                        })}
                                    </Table.Td>
                                    <Table.Td>{route.route.departure}</Table.Td>
                                    <Table.Td>{route.route.destination}</Table.Td>
                                    <Table.Td>
                                        <Button
                                            variant="filled"
                                            color="blue"
                                            className="button"
                                            onClick={() => {
                                                setSelectedRoute(route.route);
                                                open();
                                            }}
                                        >
                                            経路参照
                                        </Button>
                                    </Table.Td>
                                    <Table.Td>{route.route.notes}</Table.Td>
                                    <Table.Td>
                                        <Button
                                            variant="filled"
                                            color="blue"
                                            className="button"
                                            onClick={() => callState(route.route)}
                                        >
                                            呼び出し
                                        </Button>
                                        <Button
                                            variant="filled"
                                            color="red"
                                            className="button"
                                            onClick={() => deleteRoute(route.id)}
                                        >
                                            削除
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>

                <Modal opened={opened} onClose={close} title="経路参照">
                    <pre className="bg-gray-100 p-5 rounded-md w-10/12">{output}</pre>
                </Modal>
            </div>
        </div>
    );
}