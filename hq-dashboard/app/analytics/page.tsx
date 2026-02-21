"use client";
import React from "react";
import ChartsClient from "../../components/ChartsClient";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-white text-2xl font-extrabold tracking-tight">Runs Analytics</h1>
      <ChartsClient />
    </div>
  );
}
