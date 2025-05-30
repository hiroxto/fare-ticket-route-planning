import { useRouteState } from "@/feature/route-state";
import { useSavedRouteState } from "@/feature/saved-route";
import { Button, Modal, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useState } from "react";
import "dayjs/locale/ja";
import { ConfirmationModal, useConfirmationModal } from "@/components/ConfirmationModal";
import { SoundButton } from "@/components/SoundButton";
import { useInputSettingStore } from "@/feature/input-setting";

export default function ControlButtons() {
    const type = useRouteState(state => state.type);
    const month = useRouteState(state => state.month);
    const day = useRouteState(state => state.day);
    const dateOption = useRouteState(state => state.dateOption);
    const departure = useRouteState(state => state.departure);
    const destination = useRouteState(state => state.destination);
    const routes = useRouteState(state => state.routes);
    const notes = useRouteState(state => state.notes);
    const resetType = useRouteState(state => state.resetType);
    const setMonth = useRouteState(state => state.setMonth);
    const setDay = useRouteState(state => state.setDay);
    const setDateWithIndex = useRouteState(state => state.setDateWithIndex);
    const useDate = useRouteState(state => state.useDate);
    const skipDate = useRouteState(state => state.skipDate);
    const reverse = useRouteState(state => state.reverse);
    const resetStations = useRouteState(state => state.resetStations);
    const savedRoutes = useSavedRouteState(state => state.routes);
    const [saveToID, setSaveToID] = useState<string | null>(null);
    const saveRoute = useSavedRouteState(state => state.saveRoute);
    const updateRoute = useSavedRouteState(state => state.updateRoute);
    const [isOpenedCalenderModel, { open: openCalenderModal, close: closeCalenderModal }] = useDisclosure(false);
    const [calendarValue, setCalendarValue] = useState<Date | null>(null);
    const [isOpenedSaveModel, { open: openSaveModal, close: closeSaveModal }] = useDisclosure(false);
    const {
        isOpened: isOpenedClearSettingModal,
        openModal: openClearSettingModal,
        closeModal: closeClearSettingModal,
        handleConfirm: handleClearSettingConfirm,
    } = useConfirmationModal();

    const addRoute = useRouteState(state => state.addRoute);
    const deleteEmptyRoutes = useRouteState(state => state.deleteEmptyRoutes);
    const deleteAllRoutes = useRouteState(state => state.deleteAllRoutes);
    const {
        isOpened: isOpenedClearAllRoutesModal,
        openModal: openClearAllRoutesModal,
        closeModal: closeClearAllRoutesModal,
        handleConfirm: handleClearAllRoutesConfirm,
    } = useConfirmationModal();
    const resetNotes = useRouteState(state => state.resetNotes);
    const {
        isOpened: isOpenedClearNotesModal,
        openModal: openClearNotesModal,
        closeModal: closeClearNotesModal,
        handleConfirm: handleClearNotesConfirm,
    } = useConfirmationModal();
    const useComplete = useInputSettingStore(state => state.useComplete);
    const enableComplete = useInputSettingStore(state => state.enableComplete);
    const disableComplete = useInputSettingStore(state => state.disableComplete);

    return (
        <>
            <SoundButton
                variant="filled"
                color="gray"
                className="button"
                onClick={() => setDateWithIndex(0)}
                soundType="click"
            >
                本日
            </SoundButton>
            <SoundButton
                variant="filled"
                color="gray"
                className="button"
                onClick={() => setDateWithIndex(1)}
                soundType="click"
            >
                明日
            </SoundButton>
            <SoundButton
                variant="filled"
                color="gray"
                className="button"
                onClick={() => setDateWithIndex(2)}
                soundType="click"
            >
                明後日
            </SoundButton>
            <SoundButton variant="filled" color="gray" className="button" onClick={openCalenderModal} soundType="click">
                カレンダー入力
            </SoundButton>
            <SoundButton variant="filled" color="gray" className="button" onClick={useDate} soundType="click">
                利用日表示
            </SoundButton>
            <SoundButton variant="filled" color="gray" className="button" onClick={skipDate} soundType="click">
                利用日省略
            </SoundButton>
            <SoundButton variant="filled" color="gray" className="button" onClick={reverse} soundType="click">
                発着逆転
            </SoundButton>
            <SoundButton
                variant="filled"
                color="red"
                className="button"
                onClick={() =>
                    openClearSettingModal(() => {
                        resetType();
                        useDate();
                        resetStations();
                    })
                }
                soundType="chime"
            >
                設定クリア
            </SoundButton>
            <Button variant="filled" color="blue" className="button" component={Link} href="/states">
                保存済み経路
            </Button>
            <SoundButton variant="filled" color="blue" className="button" onClick={openSaveModal} soundType="click">
                保存・更新
            </SoundButton>

            <Modal opened={isOpenedCalenderModel} onClose={closeCalenderModal} title="カレンダー入力" size="auto">
                <DatePicker
                    value={calendarValue}
                    onChange={newValue => {
                        if (
                            calendarValue !== null &&
                            newValue !== null &&
                            calendarValue?.getMonth() === newValue?.getMonth() &&
                            calendarValue?.getDay() === newValue?.getDay()
                        ) {
                            setMonth(String(newValue.getMonth() + 1));
                            setDay(String(newValue.getDate()));
                            closeCalenderModal();
                        }

                        setCalendarValue(newValue);
                    }}
                    firstDayOfWeek={0}
                    locale="ja"
                    level="month"
                    minDate={new Date()}
                    size="xl"
                />
            </Modal>
            <Modal opened={isOpenedSaveModel} onClose={closeSaveModal} title="保存・更新">
                <SoundButton
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
                        closeSaveModal();
                    }}
                    soundType="click"
                >
                    新規保存
                </SoundButton>

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
                <SoundButton
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
                        closeSaveModal();
                    }}
                    soundType="click"
                >
                    更新
                </SoundButton>
            </Modal>
            <ConfirmationModal
                opened={isOpenedClearSettingModal}
                onClose={closeClearSettingModal}
                onConfirm={handleClearSettingConfirm}
                title="設定のクリア"
                message="設定をクリアしますか？"
                confirmButtonText="クリア"
            />

            <SoundButton
                variant="filled"
                color="gray"
                className="button"
                onClick={() => addRoute(-1)}
                soundType="click"
            >
                経路追加
            </SoundButton>
            <SoundButton variant="light" color="red" className="button" onClick={deleteEmptyRoutes} soundType="click">
                空経路クリア
            </SoundButton>
            <SoundButton
                variant="filled"
                color="red"
                className="button"
                onClick={() => openClearAllRoutesModal(deleteAllRoutes)}
                soundType="chime"
            >
                全経路クリア
            </SoundButton>
            <SoundButton
                variant="filled"
                color={useComplete ? "gray" : "blue"}
                className="button"
                onClick={() => (useComplete ? disableComplete() : enableComplete())}
                soundType="click"
            >
                {useComplete ? "補完無効化" : "補完有効化"}
            </SoundButton>

            <ConfirmationModal
                opened={isOpenedClearAllRoutesModal}
                onClose={closeClearAllRoutesModal}
                onConfirm={handleClearAllRoutesConfirm}
                title="全経路のクリア"
                message="全経路をクリアしますか？"
                confirmButtonText="クリア"
            />

            <SoundButton
                variant="filled"
                color="red"
                className="button"
                onClick={() => openClearNotesModal(resetNotes)}
                soundType="chime"
            >
                備考クリア
            </SoundButton>

            <ConfirmationModal
                opened={isOpenedClearNotesModal}
                onClose={closeClearNotesModal}
                onConfirm={handleClearNotesConfirm}
                title="備考のクリア"
                message="備考をクリアしますか？"
                confirmButtonText="クリア"
            />
        </>
    );
}
