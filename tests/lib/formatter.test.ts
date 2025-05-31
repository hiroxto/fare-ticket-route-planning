import { describe, expect, it } from "vitest";
import { format } from "~/src/lib/formatter";
import type { Route } from "~/types";

describe("format", () => {
    it("空経路の場合は空文字を返すこと", () => {
        const routes: Route[] = [];
        const result = format(routes);
        expect(result).toBe("");
    });

    it("経路をフォーマットできること", () => {
        const routes: Route[] = [
            { id: crypto.randomUUID(), line: "東海道線", station: "東京" },
            { id: crypto.randomUUID(), line: "東北線", station: "" },
        ];
        const result = format(routes);
        const expected = `東海道線
     東京
東北線`;
        expect(result).toBe(expected);
    });
});
