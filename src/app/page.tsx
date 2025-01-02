import type { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
    title: "乗車券の経路作成",
    description: "複雑な経路の乗車券作る際の補助ツール",
};

export default function Home() {
    return <Content />;
}
