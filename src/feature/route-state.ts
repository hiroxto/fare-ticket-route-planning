import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Route, TicketType } from "~/types";

interface RouteState {
    type: TicketType;
    month: string;
    day: string;
    dateOption: "use" | "skip";
    departure: string;
    via: string; // 将来的に連続乗車券で使う
    destination: string;
    routes: Route[];
    routes2: Route[]; // 将来的に連続乗車券で使う
    notes: string;
}

interface Action {
    // 設定
    setType: (type: TicketType) => void;
    resetType: () => void;
    setDeparture: (departure: string) => void;
    setDestination: (destination: string) => void;
    setMonth: (month: string) => void;
    setDay: (day: string) => void;
    setDateWithIndex: (addDate: number) => void;
    useDate: () => void;
    skipDate: () => void;

    // 経路
    addRoute: (index: number) => void;
    updateLine: (index: number, line: string) => void;
    updateStation: (index: number, station: string) => void;
    deleteRoute: (index: number) => void;
    deleteEmptyRoutes: () => void;
    deleteAllRoutes: () => void;
    reverse: () => void;
    resetStations: () => void;

    // 備考
    setNotes: (notes: string) => void;
    resetNotes: () => void;

    // その他機能
    reconstruct: (state: Partial<RouteState>) => void;
}

export const createRoute = (): Route => ({ id: crypto.randomUUID(), line: "", station: "" });

export const useRouteState = create<RouteState & Action>()(
    devtools(
        persist(
            set => {
                return {
                    type: "片道乗車券",
                    month: "",
                    day: "",
                    dateOption: "use",
                    departure: "",
                    via: "",
                    destination: "",
                    routes: [createRoute()],
                    routes2: [],
                    notes: "",

                    // 設定
                    setType(type) {
                        set({ type });
                    },
                    resetType() {
                        set({ type: "片道乗車券" });
                    },
                    setDeparture(departure) {
                        set({ departure });
                    },
                    setDestination(destination) {
                        set({ destination });
                    },
                    setMonth(month) {
                        set({ month });
                    },
                    setDay(day) {
                        set({ day });
                    },
                    setDateWithIndex(addDate) {
                        const today = new Date();
                        today.setDate(today.getDate() + addDate);
                        set({
                            dateOption: "use",
                            month: (today.getMonth() + 1).toString(),
                            day: today.getDate().toString(),
                        });
                    },
                    useDate() {
                        set({ dateOption: "use" });
                    },
                    skipDate() {
                        set({ dateOption: "skip", month: "", day: "" });
                    },

                    // 経路
                    addRoute(index) {
                        if (index <= -1) {
                            set(state => ({
                                routes: [...state.routes, createRoute()],
                            }));
                        } else {
                            set(state => {
                                const routes = state.routes;
                                routes.splice(index + 1, 0, createRoute());

                                return { routes: [...routes] };
                            });
                        }
                    },
                    updateLine(index, line) {
                        set(state => {
                            const routes = state.routes;
                            routes[index].line = line;
                            return { routes: [...routes] };
                        });
                    },
                    updateStation(index, station) {
                        set(state => {
                            const routes = state.routes;
                            routes[index].station = station;
                            return { routes: [...routes] };
                        });
                    },
                    deleteRoute(index) {
                        set(state => {
                            const routes = state.routes;
                            routes.splice(index, 1);
                            return { routes: [...routes] };
                        });
                    },
                    deleteEmptyRoutes() {
                        set(state => {
                            const valuedRoutes = state.routes.filter(
                                route => route.line.trim() !== "" || route.station.trim() !== "",
                            );

                            return {
                                routes: valuedRoutes.length === 0 ? [createRoute()] : [...valuedRoutes],
                            };
                        });
                    },
                    deleteAllRoutes() {
                        set({ routes: [createRoute()] });
                    },
                    reverse() {
                        set(state => {
                            // 先に空経路を削除
                            const routes = state.routes.filter(route => {
                                return route.line.trim() !== "" || route.station.trim() !== "";
                            });

                            // 経路を逆転して線区と接続駅を付け替える
                            const newRoute = routes.reverse().map((route, index, orig) => {
                                route.station = orig[index + 1] == null ? "" : orig[index + 1].station;
                                return route;
                            });

                            return {
                                departure: state.destination,
                                destination: state.departure,
                                routes: newRoute,
                            };
                        });
                    },
                    resetStations() {
                        set({ departure: "", via: "", destination: "" });
                    },

                    // 記事
                    setNotes(notes) {
                        set({ notes });
                    },
                    resetNotes() {
                        set({ notes: "" });
                    },

                    // 機能
                    reconstruct(state) {
                        set(state);
                    },
                };
            },
            {
                name: "route-state",
            },
        ),
    ),
);
