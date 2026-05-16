import pipelineService, { Pipeline, PipelineInfo } from "@/entity/Pipeline";
import createAccurateContext from "@/shared/lib/createAccurateContext";
import { Spinner } from "@/shared/ui/spinner";
import { ReactNode, useEffect, useState } from "react";

export const PipelineContext = createAccurateContext<PipelineInfo>();
export function PipelineProvider({
    pipelineId,
    children,
}: {
    pipelineId: Pipeline["id"];
    children: ReactNode;
}) {
    const [pipelineInfo, setPipelineInfo] = useState<PipelineInfo>();
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        console.log("effects", pipelineId);
        pipelineService.getInfo(pipelineId).then((res) => {
            if (res.ok) {
                setPipelineInfo(res.body);
            } else {
                setErrors(res.errors);
            }
        });
    }, []);
    if (errors.length !== 0)
        return <div>Произошли ошибки: {errors?.join(" ")}</div>;
    if (!pipelineInfo) return <Spinner />;
    return (
        <PipelineContext.Provider value={pipelineInfo}>
            {children}
        </PipelineContext.Provider>
    );
}
