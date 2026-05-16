import pipelineService, { Pipeline, PipelineInfo } from "@/entity/Pipeline";
import createAccurateContext from "@/shared/lib/createAccurateContext";
import { Spinner } from "@/shared/ui/spinner";
import { ReactNode, useEffect, useState } from "react";

const PipelineContext = createAccurateContext<{
    pipeline: PipelineInfo;
}>();
export function PipelineProvider({
    pipelineId,
    children,
}: {
    pipelineId: Pipeline["id"];
    children: ReactNode;
}) {
    const [pipeline, setPipeline] = useState<PipelineInfo>();
    const [errors, setErrors] = useState<string[]>([]);
    if (errors.length !== 0)
        return <div>Произошли ошибки: {errors?.join(" ")}</div>;
    if (!pipeline) return <Spinner />;
    useEffect(() => {
        pipelineService.getInfo(pipelineId).then((res) => {
            if (res.ok) {
                setPipeline(res.body);
            } else {
                setErrors(res.errors);
            }
        });
    }, []);
    return (
        <PipelineContext.Provider
            value={{
                pipeline,
            }}
        >
            {children}
        </PipelineContext.Provider>
    );
}
