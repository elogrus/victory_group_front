"use client";
import { PipelineProvider } from "@/features/Dashboard/providers/Pipeline/PipelineProvider";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

export default function PipelineLayout({ children }: { children: ReactNode }) {
    const params = useParams();
    const pipelineId = +params.pipelineId!;
    return (
        <PipelineProvider pipelineId={pipelineId}>{children}</PipelineProvider>
    );
}
