import type { Route } from "~/types";

export class DefaultFormatter {
    private readonly routes: Route[];

    constructor(routes: Route[]) {
        this.routes = routes;
    }

    format(): string {
        return this.routes.length === 0 ? "" : this.createRoutesOutput();
    }

    createRoutesOutput(): string {
        const exceptLastRoutes = this.routes.slice(0, this.routes.length - 1);
        const lastRoute = this.routes.slice(-1)[0];
        const output = `${exceptLastRoutes.map(route => `${route.line} (${route.station})`).join(" ")} ${lastRoute.line}`;

        return output.trim();
    }
}

export class LikeMr52Formatter {
    private readonly routes: Route[];

    constructor(routes: Route[]) {
        this.routes = routes;
    }

    format(): string {
        return this.routes.length === 0 ? "" : this.createRoutesOutput();
    }

    createRoutesOutput(): string {
        const exceptLastRoutes = this.routes.slice(0, this.routes.length - 1);
        const lastRoute = this.routes.slice(-1)[0];
        const output = `${exceptLastRoutes.map(route => `${route.line}\n     ${route.station}\n`).join("")}${lastRoute.line}`;

        return output.trim();
    }
}
