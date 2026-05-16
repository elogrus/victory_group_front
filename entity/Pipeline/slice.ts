import { createAppSlice } from "@/shared/lib/createAppSlice";
import pipelineservice, { Pipeline } from ".";
import pipelineService from ".";

interface State {
    isLoading: boolean;
    pipelines: Pipeline[] | null;
    errors: string[] | null;
}

const initialState: State = {
    isLoading: false,
    pipelines: null,
    errors: null,
};

export const pipelinesSlice = createAppSlice({
    name: "pipelines",
    initialState,
    reducers: (create) => ({
        clear: create.reducer((state) => {
            state.pipelines = null;
        }),

        // Асинхронный reducer (с createAsyncThunk-like поведением)
        fetchPipelines: create.asyncThunk(
            async (projectId: Pipeline["id"], { rejectWithValue }) => {
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
                    state.errors = (action.payload as string[]) || null;
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
export const { clear, fetchPipelines } = pipelinesSlice.actions;

// Экспорт selectors
export const { selectPipelines, selectIsLoading, selectErrors } =
    pipelinesSlice.selectors;
