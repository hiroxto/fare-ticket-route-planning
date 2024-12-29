import type { Metadata } from "next";
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
            <body>{children}</body>
        </html>
    );
}
