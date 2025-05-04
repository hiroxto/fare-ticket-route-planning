"use client";

import { ConfirmationModal, useConfirmationModal } from "@/components/ConfirmationModal";
import { useRouteState } from "@/feature/route-state";
import { type RouteState, useSavedRouteState } from "@/feature/saved-route";
import { LikeMr52Formatter } from "@/lib/formatter";
import { Button, Checkbox, Group, Modal, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { SoundButton } from "@/components/SoundButton";

export default function Content() {
    const router = useRouter();
    const routes = useSavedRouteState(state => state.routes);
    const deleteRoute = useSavedRouteState(state => state.deleteRoute);
    const bulkDeleteRoute = useSavedRouteState(state => state.bulkDeleteRoute);
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
    const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([]);
    const allRouteIds = useMemo(() => routes.map(r => r.id), [routes]);
    const isAllSelected = useMemo(
        () => selectedRouteIds.length === allRouteIds.length,
        [selectedRouteIds, allRouteIds],
    );

    const {
        isOpened: isOpenedBulkDeleteModal,
        openModal: openBulkDeleteModal,
        closeModal: closeBulkDeleteModal,
        handleConfirm: handleBulkDeleteConfirm,
    } = useConfirmationModal();

    const {
        isOpened: isOpenedIndividualDeleteModal,
        openModal: openIndividualDeleteModal,
        closeModal: closeIndividualDeleteModal,
        handleConfirm: handleIndividualDeleteConfirm,
    } = useConfirmationModal();

    return (
        <div className="app">
            <div className="container">
                <div className="title-group">
                    <h1 className="title">保存済み経路</h1>
                    <p className="description">保存した経路の一覧と操作</p>
                    <Group gap="xs">
                        <Button variant="filled" color="blue" className="button" component={Link} href="/">
                            入力画面
                        </Button>
                        <Button
                            variant="filled"
                            color="red"
                            className="button"
                            disabled={selectedRouteIds.length === 0}
                            onClick={() =>
                                openBulkDeleteModal(() => {
                                    bulkDeleteRoute(selectedRouteIds);
                                    setSelectedRouteIds([]);
                                })
                            }
                        >
                            削除
                        </Button>
                    </Group>
                </div>

                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                <Checkbox
                                    size="xs"
                                    checked={selectedRouteIds.length > 0 && isAllSelected}
                                    indeterminate={selectedRouteIds.length > 0 && !isAllSelected}
                                    aria-label={isAllSelected ? "全選択解除" : "全選択"}
                                    onChange={e =>
                                        e.target.checked ? setSelectedRouteIds(allRouteIds) : setSelectedRouteIds([])
                                    }
                                ></Checkbox>
                            </Table.Th>
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
                                    <Table.Td>
                                        <Checkbox
                                            aria-label="選択"
                                            size="xs"
                                            checked={selectedRouteIds.includes(route.id)}
                                            onChange={event =>
                                                setSelectedRouteIds(
                                                    event.currentTarget.checked
                                                        ? [...selectedRouteIds, route.id]
                                                        : selectedRouteIds.filter(id => id !== route.id),
                                                )
                                            }
                                        ></Checkbox>
                                    </Table.Td>
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
                                        <SoundButton
                                            variant="filled"
                                            color="blue"
                                            className="button"
                                            onClick={() => {
                                                setSelectedRoute(route.route);
                                                open();
                                            }}
                                            soundType="click"
                                        >
                                            経路参照
                                        </SoundButton>
                                    </Table.Td>
                                    <Table.Td>{route.route.notes}</Table.Td>
                                    <Table.Td>
                                        <SoundButton
                                            variant="filled"
                                            color="blue"
                                            className="button"
                                            onClick={() => callState(route.route)}
                                            soundType="click"
                                        >
                                            呼び出し
                                        </SoundButton>
                                        <Button
                                            variant="filled"
                                            color="red"
                                            className="button"
                                            onClick={() =>
                                                openIndividualDeleteModal(() => {
                                                    deleteRoute(route.id);
                                                })
                                            }
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

                <ConfirmationModal
                    opened={isOpenedBulkDeleteModal}
                    onClose={closeBulkDeleteModal}
                    onConfirm={handleBulkDeleteConfirm}
                    title="経路の削除"
                    message="選択した経路を削除しますか？"
                    confirmButtonText="削除"
                />

                <ConfirmationModal
                    opened={isOpenedIndividualDeleteModal}
                    onClose={closeIndividualDeleteModal}
                    onConfirm={handleIndividualDeleteConfirm}
                    title="経路の削除"
                    message="この経路を削除しますか？"
                    confirmButtonText="削除"
                />
            </div>
        </div>
    );
}
