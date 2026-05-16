import { Pipeline } from "@/entity/Pipeline";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, Layout, MoreHorizontal, Trash2 } from "lucide-react";

interface Props {
    pipeline: Pipeline;
    isActive: boolean;
    onClick?: () => void;
    onRename?: () => void;
    onDelete?: () => void;
}

export function SortableBoardTab({
    pipeline,
    isActive,
    onClick = () => {},
    onRename = () => {},
    onDelete = () => {},
}: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: pipeline.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${isActive ? "bg-muted border-border text-foreground shadow-sm" : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
        >
            <Layout className="w-4 h-4" />
            <span>{pipeline.name}</span>
            <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-5 h-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-0 data-[state=open]:opacity-100"
                        >
                            <MoreHorizontal className="w-3 h-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem
                            onClick={() => {
                                const newName = prompt(
                                    "Новое название доски:",
                                    pipeline.name,
                                );
                                if (newName && newName.trim())
                                    onRename(pipeline.id, newName.trim());
                            }}
                        >
                            <Edit2 className="w-4 h-4 mr-2" /> Переименовать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(pipeline.id)}
                            className="text-red-500 focus:text-red-500"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
