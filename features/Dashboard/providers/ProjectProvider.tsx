"use client";

import pipelineService, { Pipeline } from "@/entity/Pipeline";
import { Project } from "@/entity/Project";
import createAccurateContext from "@/shared/lib/createAccurateContext";
import { Spinner } from "@/shared/ui/spinner";
import { ReactNode, useEffect, useState } from "react";

export const ProjectContext = createAccurateContext<Pipeline[]>();
export function ProjectProvider({
    projectId,
    children,
}: {
    projectId: Project["id"];
    children: ReactNode;
}) {
    console.log("PROJECT CONTEXT", projectId);
    const [pipelines, setPipelines] = useState<Pipeline[]>();
    const [errors, setErrors] = useState<string[]>([]);
    useEffect(() => {
        console.log("ProjectContext");
        pipelineService.getList(projectId).then((res) => {
            if (res.ok) {
                setPipelines(res.body);
            } else {
                setErrors(res.errors);
            }
        });
    }, []);
    if (errors.length !== 0)
        return <div>Произошли ошибки: {errors.join(" ")}</div>;
    if (!pipelines) return <Spinner />;
    return (
        <ProjectContext.Provider value={pipelines}>
            {children}
        </ProjectContext.Provider>
    );
}
