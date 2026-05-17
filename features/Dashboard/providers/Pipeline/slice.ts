import columnService, { Column } from "@/entity/Column";
import pipelineService, { Pipeline, PipelineInfo } from "@/entity/Pipeline";
import { Project } from "@/entity/Project";
import taskService, { Task } from "@/entity/Task";
import { createAppSlice } from "@/shared/lib/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface State {
    isLoading: boolean;
    pipelineInfo: PipelineInfo | null;
    errors: string[];
}

const initialState: State = {
    isLoading: false,
    pipelineInfo: null,
    errors: [],
};

export const pipelineSlice = createAppSlice({
    name: "pipeline",
    initialState,
    reducers: (create) => ({
        clear: create.reducer((state) => {
            state.pipelineInfo = null;
            state.errors = [];
        }),

        // Асинхронный reducer (с createAsyncThunk-like поведением)
        fetchPipelineInfo: create.asyncThunk(
            async (pipelineId: Pipeline["id"], { rejectWithValue }) => {
                const res = await pipelineService.getInfo(pipelineId);
                if (!res.ok) {
                    return rejectWithValue(res.errors);
                }
                return res.body;
            },
            {
                pending: (state) => {
                    state.isLoading = true;
                },
                fulfilled: (state, action) => {
                    state.isLoading = false;
                    state.pipelineInfo = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.errors = action.payload as string[];
                    toast.error(
                        state.errors[0] ??
                            "Произошла ошибка при загрузке пайплайна",
                    );
                },
            },
        ),

        addColumn: create.reducer(
            (
                state,
                action: PayloadAction<{
                    pipelineId: Pipeline["id"];
                    newColumn: Column;
                }>,
            ) => {
                if (!state.pipelineInfo) return;
                const { pipelineId, newColumn } = action.payload;
                state.pipelineInfo.columns = [
                    ...state.pipelineInfo.columns,
                    { ...newColumn, pipeline_id: pipelineId, tasks: [] },
                ];
            },
        ),

        fetchCreateColumn: create.asyncThunk(
            async (
                payload: {
                    pipelineId: Pipeline["id"];
                    columnFields: Omit<Column, "id">;
                },
                { rejectWithValue, dispatch },
            ) => {
                const { pipelineId, columnFields } = payload;

                const res = await columnService.create(
                    pipelineId,
                    columnFields,
                );
                if (!res.ok) {
                    toast.error(
                        res.errors[0] ??
                            "Произошла ошибка при создании колонки",
                    );
                    return;
                }
                dispatch(
                    addColumn({
                        pipelineId,
                        newColumn: res.body.column,
                    }),
                );
            },
        ),

        modifyColumn: create.reducer(
            (
                state,
                action: PayloadAction<{
                    columnId: Column["id"];
                    newColumn: Column;
                }>,
            ) => {
                if (!state.pipelineInfo) return;
                const { columnId, newColumn } = action.payload;
                const columnIndex = state.pipelineInfo.columns.findIndex(
                    (col) => col.id === columnId,
                );
                if (columnIndex === -1) return;
                state.pipelineInfo.columns[columnIndex] = {
                    ...state.pipelineInfo.columns[columnIndex],
                    ...newColumn,
                };
            },
        ),

        fetchModifyColumn: create.asyncThunk(
            async (
                payload: {
                    pipelineId: Pipeline["id"];
                    columnId: Column["id"];
                    columnFields: Partial<Column>;
                },
                { rejectWithValue, dispatch },
            ) => {
                const { pipelineId, columnId, columnFields } = payload;

                const res = await columnService.update(
                    pipelineId,
                    columnId,
                    columnFields,
                );
                if (!res.ok) {
                    toast.error(
                        res.errors[0] ??
                            "Произошла ошибка при обновлении колонки",
                    );
                    return;
                }

                dispatch(
                    modifyColumn({
                        columnId: columnId,
                        newColumn: res.body.column,
                    }),
                );
            },
        ),
        removeColumn: create.reducer(
            (state, action: PayloadAction<Column["id"]>) => {
                if (!state.pipelineInfo) return;
                const columnId = action.payload;
                state.pipelineInfo.columns = state.pipelineInfo.columns.filter(
                    (c) => c.id !== columnId,
                );
            },
        ),
        fetchRemoveColumn: create.asyncThunk(
            async (
                payload: {
                    pipelineId: Pipeline["id"];
                    columnId: Column["id"];
                },
                { rejectWithValue, dispatch },
            ) => {
                const { pipelineId, columnId } = payload;

                const res = await columnService.delete(pipelineId, columnId);
                if (!res.ok) {
                    toast.error(
                        res.errors[0] ??
                            "Произошла ошибка при удалении колонки",
                    );
                    return;
                }

                dispatch(removeColumn(columnId));
                return { pipelineId, columnId };
            },
        ),
        addTask: create.reducer(
            (
                state,
                action: PayloadAction<{
                    columnId: Column["id"];
                    newTask: Task;
                }>,
            ) => {
                const { columnId, newTask } = action.payload;
                if (!state.pipelineInfo) return;
                const column = state.pipelineInfo.columns.find(
                    (col) => col.id === columnId,
                );
                if (!column) return;

                column.tasks = [...column.tasks, newTask];
            },
        ),
        fetchCreateTask: create.asyncThunk(
            async (
                payload: {
                    projectId: Project["id"];
                    pipelineId: Pipeline["id"];
                    columnId: Column["id"];
                    taskFields: {
                        external_id: string;
                        title: string;
                        column_id: number;
                        pipeline_id: number;
                    } & Partial<Task>;
                },
                { rejectWithValue },
            ) => {
                const { projectId, pipelineId, columnId, taskFields } = payload;

                const res = await taskService.create(projectId, taskFields);
                if (!res.ok) {
                    toast.error(
                        res.errors[0] ?? "Произошла ошибка при создании задачи",
                    );
                    return;
                }
            },
        ),

        modifyTask: create.reducer((state, action: PayloadAction<Task>) => {
            const newTask = action.payload;
            if (!state.pipelineInfo) return;
            const column = state.pipelineInfo.columns.find(
                (col) => col.id === newTask.column_id,
            );
            if (!column) return;
            const taskIndex = column.tasks.findIndex(
                (t) => t.id === newTask.id,
            );
            column.tasks[taskIndex] = newTask;
        }),

        fetchModifyTask: create.asyncThunk(
            async (
                payload: {
                    projectId: Project["id"];
                    columnId: Column["id"];
                    taskId: Task["id"];
                    taskFields: Partial<Task>;
                },
                { rejectWithValue, dispatch },
            ) => {
                const { projectId, columnId, taskId, taskFields } = payload;

                const res = await taskService.update(
                    projectId,
                    taskId,
                    taskFields,
                );
                if (!res.ok) {
                    toast.error(
                        res.errors[0] ??
                            "Произошла ошибка при обновлении задачи",
                    );
                    return;
                }

                dispatch(modifyTask(res.body.task));
            },
        ),
        removeTask: create.reducer(
            (
                state,
                action: PayloadAction<{
                    columnId: Column["id"];
                    taskId: Task["id"];
                }>,
            ) => {
                if (!state.pipelineInfo) return;
                const { columnId, taskId } = action.payload;
                const column = state.pipelineInfo.columns.find(
                    (col) => col.id === columnId,
                );
                if (!column) return;

                column.tasks = column.tasks.filter((t) => t.id !== taskId);
            },
        ),
        fetchRemoveTask: create.asyncThunk(
            async (
                payload: {
                    projectId: Project["id"];
                    columnId: Column["id"];
                    taskId: Task["id"];
                },
                { rejectWithValue, dispatch },
            ) => {
                const { projectId, columnId, taskId } = payload;

                const res = await taskService.delete(projectId, taskId);
                if (!res.ok) {
                    toast.error(
                        res.errors[0] ?? "Произошла ошибка при удалении задачи",
                    );
                    return;
                }

                dispatch(
                    removeTask({
                        columnId,
                        taskId,
                    }),
                );
            },
        ),
    }),
    selectors: {
        selectAll: (state) => state,
        selectPipelineInfo: (state) => state.pipelineInfo,
        selectIsLoading: (state) => state.isLoading,
        selectErrors: (state) => state.errors,
    },
});

// Экспорт actions
export const {
    clear,
    fetchPipelineInfo,

    addTask,
    fetchCreateTask,

    modifyTask,
    fetchModifyTask,

    removeTask,
    fetchRemoveTask,

    addColumn,
    fetchCreateColumn,

    modifyColumn,
    fetchModifyColumn,

    removeColumn,
    fetchRemoveColumn,
} = pipelineSlice.actions;

// Экспорт selectors
export const { selectAll, selectPipelineInfo, selectIsLoading, selectErrors } =
    pipelineSlice.selectors;
