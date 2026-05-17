"use client";
import {
    selectIsLoading,
    selectPipelines,
} from "@/features/Dashboard/providers/Project/slice";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { redirect, useParams } from "next/navigation";

export default function ProjectPage() {
    const isLoading = useAppSelector(selectIsLoading);
    const pipelines = useAppSelector(selectPipelines);
    console.log("isLoading", isLoading);
    const { projectId } = useParams();
    if (
        isLoading ||
        !pipelines ||
        pipelines.length === 0 ||
        pipelines[0].project_id !== +projectId!
    )
        return;
    return redirect(`/d/${projectId}/${pipelines[0].id}`);
}
