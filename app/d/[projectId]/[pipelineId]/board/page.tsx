"use client";

import { modifyColumn } from "@/features/Dashboard/providers/Pipeline/slice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { Button } from "@/shared/ui/button";

export default function Board() {
    const columns = useAppSelector(
        (state) => state.pipeline.pipelineInfo?.columns,
    );
    const dispatch = useAppDispatch();
    return (
        <div className="flex flex-col gap-2">
            {columns?.map((c) => (
                <span key={c.id}>
                    {c.id} - {c.name}
                    <Button
                        onClick={async () => {
                            console.log("start loading");
                            dispatch(
                                modifyColumn({
                                    columnId: c.id,
                                    pipelineId: c.pipeline_id,
                                    columnFields: {
                                        name: "aboba222",
                                    },
                                }),
                            );
                            console.log("end loading");
                        }}
                    >
                        modify name to aboba222
                    </Button>
                </span>
            ))}
        </div>
    );
}
