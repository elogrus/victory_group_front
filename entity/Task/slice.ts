// import { createAppSlice } from "@/shared/lib/createAppSlice";
// import taskService, { Task } from ".";

// interface State {
//     isLoading: boolean;
//     tasks: Task[] | null;
//     errors: string[] | null;
// }

// const initialState: State = {
//     isLoading: false,
//     tasks: null,
//     errors: null,
// };

// export const projectsSlice = createAppSlice({
//     name: "tasks",
//     initialState,
//     reducers: (create) => ({
//         clear: create.reducer((state) => {
//             state.tasks = null;
//         }),

//         // Асинхронный reducer (с createAsyncThunk-like поведением)
//         fetchProjects: create.asyncThunk(
//             async ({}, { rejectWithValue }) => {
//                 const res = await taskService.getAllPipeline();
//                 if (!res.ok) {
//                     console.log("ошибка getUser UserSlice");
//                     return rejectWithValue(res.errors);
//                 }
//                 console.log("OK getUser UserSlice");
//                 return res.body;
//             },
//             {
//                 pending: (state) => {
//                     state.isLoading = true;
//                 },
//                 fulfilled: (state, action) => {
//                     state.isLoading = false;
//                     state.tasks = action.payload;
//                 },
//                 rejected: (state, action) => {
//                     state.isLoading = false;
//                     state.errors = (action.payload as string[]) || null;
//                 },
//             },
//         ),
//     }),
//     selectors: {
//         selectTasks: (state) => state.tasks,
//         selectIsLoading: (state) => state.isLoading,
//         selectErrors: (state) => state.errors,
//     },
// });

// // Экспорт actions
// export const { clear, fetchProjects } = projectsSlice.actions;

// // Экспорт selectors
// export const { selectProjects, selectIsLoading, selectErrors } =
//     projectsSlice.selectors;
