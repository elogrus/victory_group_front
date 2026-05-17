"use client";
import { Pipeline } from "@/entity/Pipeline";
import { Layout } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Props {
    pipeline: Pipeline;
    isActive: boolean;
}

export function SortableBoardTab({ pipeline, isActive }: Props) {
    const params = useParams();
    return (
        <Link
            href={`/d/${params.projectId}/${pipeline.id}`}
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${isActive ? "bg-muted border-border text-foreground shadow-sm" : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
        >
            <Layout className="w-4 h-4" />
            <span>{pipeline.name}</span>
        </Link>
    );
}
