import { Column } from "@/entity/Column";
import pipelineService, { Pipeline } from "@/entity/Pipeline";
import { Project } from "@/entity/Project";
import createAccurateContext from "@/shared/lib/createAccurateContext";
import { Spinner } from "@/shared/ui/spinner";
import { ReactNode, useEffect, useState } from "react";

const ProjectContext = createAccurateContext<{
    pipelines: Pipeline[];
}>();
export function ProjectProvider({
    projectId,
    children,
}: {
    projectId: Project["id"];
    children: ReactNode;
}) {
    const [pipelines, setPipelines] = useState<Pipeline[]>();
    const [errors, setErrors] = useState<string[]>([]);
    if (errors.length !== 0)
        return <div>Произошли ошибки: {errors?.join(" ")}</div>;
    if (!pipelines) return <Spinner />;
    useEffect(() => {
        pipelineService.getList(projectId).then((res) => {
            if (res.ok) {
                setPipelines(res.body);
            } else {
                setErrors(res.errors);
            }
        });
    }, []);
    return (
        <ProjectContext.Provider
            value={{
                pipelines,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
