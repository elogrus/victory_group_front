import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Task } from "../shared/lib/data";

export function ListView({
    tasks,
    onTaskClick,
}: {
    tasks: Task[];
    onTaskClick: (t: Task) => void;
}) {
    return (
        <div className="border border-border/50 rounded-md bg-card overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/20">
                    <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="text-xs font-medium w-[300px]">
                            Задачи
                        </TableHead>
                        <TableHead className="text-xs font-medium">
                            Исполнитель
                        </TableHead>
                        <TableHead className="text-xs font-medium">
                            Автор
                        </TableHead>
                        <TableHead className="text-xs font-medium">
                            Приоритет
                        </TableHead>
                        <TableHead className="text-xs font-medium">
                            Статус
                        </TableHead>
                        <TableHead className="text-xs font-medium">
                            Создано
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow
                            key={task.id}
                            className="cursor-pointer border-border/50 hover:bg-muted/30"
                            onClick={() => onTaskClick(task)}
                        >
                            <TableCell className="font-medium text-sm flex items-center gap-2">
                                <span className="text-blue-400">{task.id}</span>{" "}
                                {task.title}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                Не назначено
                            </TableCell>
                            <TableCell className="text-xs">
                                {task.author}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {task.priority}
                            </TableCell>
                            <TableCell>
                                <span className="text-[10px] uppercase bg-muted px-2 py-1 rounded font-semibold">
                                    {task.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {task.createdAt}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
