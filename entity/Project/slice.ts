import { createAppSlice } from "@/shared/lib/createAppSlice";
import projectService, { Project } from ".";
import { Pipeline } from "../Pipeline";
import { createSelector, PayloadAction } from "@reduxjs/toolkit";

interface State {
    isLoading: boolean;
    projects: Project[] | null;
    errors: string[];
}

const initialState: State = {
    isLoading: false,
    projects: null,
    errors: [],
};

export const projectsSlice = createAppSlice({
    name: "projects",
    initialState,
    reducers: (create) => ({
        clear: create.reducer((state) => {
            state.projects = null;
        }),
        // Асинхронный reducer (с createAsyncThunk-like поведением)
        fetchProjects: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                console.log("FETCH PROJECTS");
                const res = await projectService.getProjectList();
                console.log("RES", res);
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
                    state.projects = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.errors = action.payload as string[];
                },
            },
        ),
    }),
    selectors: {
        selectProjects: (state) => state.projects,
        selectIsLoading: (state) => state.isLoading,
        selectErrors: (state) => state.errors,
    },
});

export const selectProjectById = createSelector(
    [
        projectsSlice.selectors.selectProjects,
        (_, projectId: Project["id"]) => projectId,
    ],
    (projects, projectId) => projects?.find((p) => p.id === projectId) ?? null,
);

// Экспорт actions
export const { clear, fetchProjects } = projectsSlice.actions;

// Экспорт selectors
export const { selectProjects, selectIsLoading, selectErrors } =
    projectsSlice.selectors;
