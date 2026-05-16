export const MOCK_ANALYTICS_DATA = {
    projectId: 2,
    generatedAt: "2026-05-16T19:18:18.926733Z",
    stats: {
        totalTasks: 2,
        completedTasks: 2,
        activeTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        completionPercent: 100,
        overdueTasks: 0,
        tasksWithoutDeadline: 2,
        unassignedTasks: 2,
        highPriorityTasks: 1,
        createdLast24Hours: 2,
        createdLast7Days: 2,
        createdLast30Days: 2,
        updatedLast24Hours: 2,
        updatedLast7Days: 2,
        updatedLast30Days: 2
    },
    columns: [
        {
            columnId: 1,
            columnName: "TO DO",
            order: 0,
            isFirstColumn: true,
            isFinalColumn: false,
            tasksCount: 1,
            completedTasks: 0,
            overdueTasks: 0,
            highPriorityTasks: 0,
            tasksWithoutDeadline: 1,
            unassignedTasks: 1
        },
        {
            columnId: 2,
            columnName: "DONE",
            order: 2,
            isFirstColumn: false,
            isFinalColumn: true,
            tasksCount: 1,
            completedTasks: 1,
            overdueTasks: 0,
            highPriorityTasks: 1,
            tasksWithoutDeadline: 1,
            unassignedTasks: 1
        }
    ],
    priorities: {
        priorityLabels: { "1": "High", "2": "Medium", "3": "Low" },
        priorityDistribution: { "1": 1, "2": 1 },
        completedByPriority: { "1": 1, "2": 1 }
    },
    activity: {
        createdLast24Hours: 2,
        createdLast7Days: 2,
        createdLast30Days: 2,
        updatedLast24Hours: 2,
        updatedLast7Days: 2,
        updatedLast30Days: 2
    },
    risks: [
        { type: "unassigned_tasks", value: 2 },
        { type: "tasks_without_deadline", value: 2 }
    ],
    aiSummary: null,
    aiProvider: "gigachat",
    aiError: "GigaChat auth network error"
};