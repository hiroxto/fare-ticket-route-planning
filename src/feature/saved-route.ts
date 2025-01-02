import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Route, TicketType } from "~/types";

export interface RouteState {
    type: TicketType;
    month: string;
    day: string;
    dateOption: "use" | "skip" | "undefined";
    departure: string;
    via: string; // 将来的に連続乗車券で使う
    destination: string;
    routes: Route[];
    routes2: Route[]; // 将来的に連続乗車券で使う
    notes: string;
}

export interface SavedRouteState {
    id: string;
    createdAtTs: number;
    route: RouteState;
}

export interface State {
    routes: SavedRouteState[];
}

export interface Action {
    saveRoute: (route: RouteState) => void;
    updateRoute: (id: string, route: Partial<RouteState>) => void;
    deleteRoute: (id: string) => void;
}

export const useSavedRouteState = create<State & Action>()(
    devtools(
        persist(
            set => {
                return {
                    routes: [],
                    saveRoute: route => {
                        set(state => ({
                            routes: [
                                ...state.routes,
                                {
                                    id: crypto.randomUUID(),
                                    createdAtTs: new Date().getTime(),
                                    route: route,
                                },
                            ],
                        }));
                    },
                    updateRoute: (id, route) => {
                        set(state => ({
                            routes: [
                                ...state.routes.map(savedRoute =>
                                    savedRoute.id === id
                                        ? {
                                              ...savedRoute,
                                              route: { ...savedRoute.route, ...route },
                                          }
                                        : savedRoute,
                                ),
                            ],
                        }));
                    },
                    deleteRoute: id => {
                        set(state => ({
                            routes: [...state.routes.filter(route => route.id !== id)],
                        }));
                    },
                };
            },
            { name: "saved-routes" },
        ),
    ),
);
