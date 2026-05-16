import { createAppSlice } from "@/shared/lib/createAppSlice";
import projectService, { Project } from ".";

interface State {
    isLoading: boolean;
    projects: Project[] | null;
    currentProject: Project | null;
    errors: string[] | null;
}

const initialState: State = {
    isLoading: false,
    projects: null,
    currentProject: null,
    errors: null,
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
        selectIsLoading: (state) => state.isLoading,
        selectErrors: (state) => state.errors,
    },
});

// Экспорт actions
export const { clear, fetchProjects } = projectsSlice.actions;

// Экспорт selectors
export const { selectProjects, selectIsLoading, selectErrors } =
    projectsSlice.selectors;
