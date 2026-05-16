import { createAppSlice } from "@/shared/lib/createAppSlice";
import projectService, { Project } from ".";
import { Pipeline } from "../Pipeline";
import { PayloadAction } from "@reduxjs/toolkit";

interface State {
    isLoading: boolean;
    projects: Project[] | null;
    currentPipeline: Pipeline["id"] | null;
    errors: string[] | null;
}

const initialState: State = {
    isLoading: false,
    projects: null,
    currentPipeline: null,
    errors: null,
};

export const projectsSlice = createAppSlice({
    name: "projects",
    initialState,
    reducers: (create) => ({
        clear: create.reducer((state) => {
            state.projects = null;
        }),
        setCurrentPipeline: create.reducer(
            (state, action: PayloadAction<Pipeline["id"]>) => {
                state.currentPipeline = action.payload;
            },
        ),
        // Асинхронный reducer (с createAsyncThunk-like поведением)
        fetchProjects: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                const res = await projectService.getProjectList();
                if (!res.ok) {
                    console.log("ошибка getUser UserSlice");
                    return rejectWithValue(res.errors);
                }
                console.log("OK getUser UserSlice");
                return res.body;
            },
            {
                pending: (state) => {
                    state.isLoading = true;
                },
                fulfilled: (state, action) => {
                    state.isLoading = false;
                    state.projects = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.errors = (action.payload as string[]) || null;
                },
            },
        ),
    }),
    selectors: {
        selectProjects: (state) => state.projects,
        selectCurrentPipeline: (state) => state.currentPipeline,
        selectIsLoading: (state) => state.isLoading,
        selectErrors: (state) => state.errors,
    },
});

// Экспорт actions
export const { clear, fetchProjects, setCurrentPipeline } =
    projectsSlice.actions;

// Экспорт selectors
export const {
    selectProjects,
    selectIsLoading,
    selectErrors,
    selectCurrentPipeline,
} = projectsSlice.selectors;
