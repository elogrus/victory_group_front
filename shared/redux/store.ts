import { projectsSlice } from "@/entity/Project/slice";
import { pipelineSlice } from "@/features/Dashboard/providers/Pipeline/slice";
import { projectSlice } from "@/features/Dashboard/providers/Project/slice";
import { adminSlice } from "@/features/Admin/slice"; // ДОБАВИЛИ ИМПОРТ
import { combineSlices, configureStore } from "@reduxjs/toolkit";

// Добавили adminSlice в список
const rootReducer = combineSlices(projectsSlice, projectSlice, pipelineSlice, adminSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];