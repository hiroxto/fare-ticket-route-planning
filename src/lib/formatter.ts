import type { Route } from "~/types";

export const format = (routes: Route[]): string => {
    if (routes.length === 0) {
        return "";
    }

    const exceptLastRoutes = routes.slice(0, routes.length - 1);
    const lastRoute = routes.slice(-1)[0];
    const output = `${exceptLastRoutes.map(route => `${route.line}\n     ${route.station}\n`).join("")}${lastRoute.line}`;

    return output.trim();
};
