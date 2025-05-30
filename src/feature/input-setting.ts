import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface State {
    // 補完を使用するか
    useComplete: boolean;
}

export interface Action {
    enableComplete: () => void;
    disableComplete: () => void;
}

export const useInputSettingStore = create<State & Action>()(
    devtools(
        persist(
            set => {
                return {
                    useComplete: true,
                    enableComplete: () => {
                        set(() => ({
                            useComplete: true,
                        }));
                    },
                    disableComplete: () => {
                        set(() => ({
                            useComplete: false,
                        }));
                    },
                };
            },
            { name: "input-setting" },
        ),
    ),
);
