import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.scss";

export const metadata: Metadata = {
    title: "Next App",
    description: "Next App",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body>
                <MantineProvider>
                    <DatesProvider settings={{}}>{children}</DatesProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
