import pipelineService, { Pipeline } from "@/entity/Pipeline";
import { Project } from "@/entity/Project";
import { createAppSlice } from "@/shared/lib/createAppSlice";

interface State {
    isLoading: boolean;
    pipelines: Pipeline[] | null;
    errors: string[];
}

const initialState: State = {
    isLoading: false,
    pipelines: null,
    errors: [],
};

export const projectSlice = createAppSlice({
    name: "project",
    initialState,
    reducers: (create) => ({
        clear: create.reducer((state) => {
            state.pipelines = null;
            state.errors = [];
        }),

        // Асинхронный reducer (с createAsyncThunk-like поведением)
        fetchProjects: create.asyncThunk(
            async (projectId: Project["id"], { rejectWithValue }) => {
                const res = await pipelineService.getList(projectId);
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
                    state.pipelines = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.errors = action.payload as string[];
                },
            },
        ),
    }),
    selectors: {
        selectPipelines: (state) => state.pipelines,
        selectIsLoading: (state) => state.isLoading,
        selectErrors: (state) => state.errors,
    },
});

// Экспорт actions
export const { clear, fetchProjects } = projectSlice.actions;

// Экспорт selectors
export const { selectPipelines, selectIsLoading, selectErrors } =
    projectSlice.selectors;
