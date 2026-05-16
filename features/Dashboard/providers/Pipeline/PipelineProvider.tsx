import { Pipeline } from "@/entity/Pipeline";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useEffect } from "react";
import { clear, fetchPipelineInfo } from "./slice";

export function PipelineProvider({
    pipelineId,
    children,
}: {
    pipelineId: Pipeline["id"];
    children: ReactNode;
}) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchPipelineInfo(pipelineId));
        return () => {
            dispatch(clear());
        };
    }, []);

    return children;
}
