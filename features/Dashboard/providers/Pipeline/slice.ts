import pipelineService, { Pipeline, PipelineInfo } from "@/entity/Pipeline";
import { Project } from "@/entity/Project";
import { createAppSlice } from "@/shared/lib/createAppSlice";
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
    }),
    selectors: {
        selectAll: (state) => state,
        selectPipelineInfo: (state) => state.pipelineInfo,
        selectIsLoading: (state) => state.isLoading,
        selectErrors: (state) => state.errors,
    },
});

// Экспорт actions
export const { clear, fetchPipelineInfo } = pipelineSlice.actions;

// Экспорт selectors
export const { selectAll, selectPipelineInfo, selectIsLoading, selectErrors } =
    pipelineSlice.selectors;
