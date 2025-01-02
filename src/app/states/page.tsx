import type { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
    title: "保存済み経路",
    description: "保存した経路の一覧と操作",
};

export default function Home() {
    return <Content />;
}
