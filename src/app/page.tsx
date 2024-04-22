'use client'
import {useState} from "react";
import Link from "next/link";
import CellularAutomata from "../components/CellularAutomata.tsx"
import WaveFunctionCollapse from "../components/WaveFunctionCollapse.tsx"

export default function HomePage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-row justify-center gap-12 px-4 py-16 ">
        <div>
          <p className="w-full text-3xl text-center p-2">Cellular Automata</p>
          <CellularAutomata/>
        </div>
        <div>
          <p className="w-full text-3xl text-center p-2">Wave Function Collapse</p>
          <WaveFunctionCollapse/>
        </div>
      </div>
    </main>
  );
}
