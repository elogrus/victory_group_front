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
    const boardSensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );
    const handleBoardDragEnd = (e: any) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        console.log("BOARD DRAG END");
        // setProjects((prev) =>
        //     prev.map((p) => {
        //         if (p.id !== activeProjId) return p;
        //         const oldIndex = p.boards.findIndex((b) => b.id === active.id);
        //         const newIndex = p.boards.findIndex((b) => b.id === over.id);
        //         return {
        //             ...p,
        //             boards: arrayMove(p.boards, oldIndex, newIndex),
        //         };
        //     }),
        // );
    };
    if (!pipelines) return <Skeleton className="w-100 h-[36px]" />;
    return (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
            <DndContext
                sensors={boardSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleBoardDragEnd}
            >
                <SortableContext
                    items={pipelines.map((p) => p.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {pipelines.map((p) => (
                        <SortableBoardTab
                            key={p.id}
                            pipeline={p}
                            isActive={
                                !!params.pipelineId &&
                                p.id === +params.pipelineId
                            }
                            // onClick={() => setActiveBoardId(board.id)}
                            // onRename={handleRenameBoard}
                            // onDelete={handleDeleteBoard}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <Button
                // onClick={() => setBoardModalOpen(true)}
                variant="ghost"
                size="sm"
                className="h-8 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 ml-1"
            >
                <Plus className="w-4 h-4 mr-1" /> Добавить доску
            </Button>
        </div>
    );
}
