import type { TicketType } from "~/types";

export const isTicketType = (type: string): type is TicketType => {
    return ["片道乗車券", "往復乗車券", "連続乗車券", "別線往復乗車券"].includes(type);
};
