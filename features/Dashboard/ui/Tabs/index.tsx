"use client";

import { useAppSelector } from "@/shared/hooks/reduxHooks";
import Link from "next/link";
import { selectPipelines } from "../../providers/Project/slice";
import { Skeleton } from "@/shared/ui/skeleton";
import {
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import { useParams } from "next/navigation";
import { SortableBoardTab } from "./SortableBoardTab";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

export function Tabs() {
    const params = useParams();
    const pipelines = useAppSelector(selectPipelines);

    if (!pipelines) return <Skeleton className="w-100 h-[36px] mb-4" />;
    return (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
            {pipelines.map((p) => (
                <SortableBoardTab
                    key={p.id}
                    pipeline={p}
                    isActive={
                        !!params.pipelineId && p.id === +params.pipelineId
                    }
                    // onClick={() => setActiveBoardId(board.id)}
                    // onRename={handleRenameBoard}
                    // onDelete={handleDeleteBoard}
                />
            ))}

            <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 ml-1"
            >
                <Plus className="w-4 h-4 mr-1" /> Добавить доску
            </Button>
        </div>
    );
}
