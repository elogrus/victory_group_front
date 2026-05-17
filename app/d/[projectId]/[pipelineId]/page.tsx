import { redirect } from "next/navigation";

export default async function PipelinePage({
    params,
}: {
    params: Promise<{ projectId: string; pipelineId: string }>;
}) {
    const { projectId, pipelineId } = await params;
    return redirect(`/d/${projectId}/${pipelineId}/board`);
}
