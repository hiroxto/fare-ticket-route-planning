"use client";

import Note from "@/components/Route/Note";
import Output from "@/components/Route/Output";
import Route from "@/components/Route/Route";
import Setting from "@/components/Route/Setting";
import React from "react";

export default function Content() {
    return (
        <div className="app">
            <div className="container">
                <div className="title-group">
                    <h1 className="title">乗車券の経路作成</h1>
                    <p className="description">複雑な経路の乗車券作る際の補助ツール</p>
                </div>

                <div className="grid grid-cols-12 xl:gap-4">
                    <Setting></Setting>

                    <Route></Route>

                    <Note></Note>

                    <Output></Output>
                </div>
            </div>
        </div>
    );
}