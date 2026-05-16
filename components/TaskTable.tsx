"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Task } from "../shared/lib/data";

export function TaskTable({
    tasks,
    onTaskClick,
}: {
    tasks: Task[];
    onTaskClick: (t: Task) => void;
}) {
    return (
        <div className="border rounded-md bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Key</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow
                            key={task.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => onTaskClick(task)}
                        >
                            <TableCell className="font-medium text-muted-foreground">
                                {task.id}
                            </TableCell>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{task.status}</Badge>
                            </TableCell>
                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {task.createdAt}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
