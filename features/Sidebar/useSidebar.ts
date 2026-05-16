import { Project } from "@/entity/Project";
import { selectIsLoading, selectProjects } from "@/entity/Project/slice";
import { useAppSelector } from "@/shared/hooks/reduxHooks";

interface ReturnType {
    projects: Project[] | null;
    isProjectsLoading: boolean;
}

export const useSidebar = (): ReturnType => {
    const isProjectsLoading = useAppSelector(selectIsLoading);
    const projects = useAppSelector(selectProjects);
    return { projects, isProjectsLoading };
};
