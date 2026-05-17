import columnService, { Column } from "@/entity/Column";
import pipelineService, { Pipeline, PipelineInfo } from "@/entity/Pipeline";
import { Project } from "@/entity/Project";
import taskService, { Task } from "@/entity/Task";
import { createAppSlice } from "@/shared/lib/createAppSlice";
import { createSelector, PayloadAction } from "@reduxjs/toolkit";
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

        modifyColumn: create.asyncThunk(
            async (
                payload: {
                    pipelineId: Pipeline["id"];
                    columnId: Column["id"];
                    columnFields: Partial<Column>;
                },
                { rejectWithValue },
            ) => {
                const { pipelineId, columnId, columnFields } = payload;

                const res = await columnService.update(
                    pipelineId,
                    columnId,
                    columnFields,
                );
                if (!res.ok) {
                    return rejectWithValue(res.errors);
                }

                return { pipelineId, columnId, newColumn: res.body.column };
            },
            {
                fulfilled: (state, action) => {
                    if (!state.pipelineInfo) return;
                    const { pipelineId, columnId, newColumn } = action.payload;
                    const columnIndex = state.pipelineInfo.columns.findIndex(
                        (col) => col.id === columnId,
                    );
                    if (columnIndex === -1) return;
                    state.pipelineInfo.columns[columnIndex] = {
                        ...state.pipelineInfo.columns[columnIndex],
                        ...newColumn,
                    };
                },
                rejected: (state, action) => {
                    toast.error(
                        state.errors[0] ??
                            "Произошла ошибка при обновлении колонки",
                    );
                },
            },
        ),

        modifyTask: create.asyncThunk(
            async (
                payload: {
                    projectId: Project["id"];
                    columnId: Column["id"];
                    taskId: Task["id"];
                    taskFields: Partial<Task>;
                },
                { rejectWithValue },
            ) => {
                const { projectId, columnId, taskId, taskFields } = payload;

                const res = await taskService.update(
                    projectId,
                    taskId,
                    taskFields,
                );
                if (!res.ok) {
                    return rejectWithValue(res.errors);
                }

                return {
                    projectId,
                    columnId,
                    taskId,
                    newTask: res.body.task,
                };
            },
            {
                fulfilled: (state, action) => {
                    if (!state.pipelineInfo) return;
                    const { projectId, columnId, taskId, newTask } =
                        action.payload;
                    const column = state.pipelineInfo.columns.find(
                        (col) => col.id === columnId,
                    );
                    if (!column) return;

                    const taskIindex = column.tasks.findIndex(
                        (t) => t.id === taskId,
                    );
                    if (taskIindex === -1) return;
                    column.tasks[taskIindex] = {
                        ...column.tasks[taskIindex],
                        ...newTask,
                    };
                },
                rejected: (state, action) => {
                    toast.error(
                        state.errors[0] ??
                            "Произошла ошибка при обновлении задачи",
                    );
                },
            },
        ),

        // modifyTask: create.reducer(
        //     (
        //         state,
        //         action: PayloadAction<{
        //             columnId: Column["id"];
        //             taskId: Task["id"];
        //             taskFields: Partial<Task>;
        //         }>,
        //     ) => {
        //         const { columnId, taskId, taskFields } = action.payload;
        //         if (!state.pipelineInfo) return;
        //         const column = state.pipelineInfo.columns.find(
        //             (col) => col.id === columnId,
        //         );
        //         if (!column) return;
        //         const taskIndex = column?.tasks.findIndex(
        //             (t) => t.id === taskId,
        //         );
        //         if (taskIndex === -1) return;
        //         column.tasks[taskIndex] = {
        //             ...column.tasks[taskIndex],
        //             ...taskFields,
        //         };
        //     },
        // ),
    }),
    selectors: {
        selectAll: (state) => state,
        selectPipelineInfo: (state) => state.pipelineInfo,
        selectIsLoading: (state) => state.isLoading,
        selectErrors: (state) => state.errors,
    },
});

// Экспорт actions
export const { clear, fetchPipelineInfo, modifyColumn, modifyTask } =
    pipelineSlice.actions;

// Экспорт selectors
export const { selectAll, selectPipelineInfo, selectIsLoading, selectErrors } =
    pipelineSlice.selectors;
