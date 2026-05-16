import useAccurateContext from "@/shared/hooks/useAccurateContext";
import Link from "next/link";
import { ProjectContext } from "../../providers/ProjectProvider";

export function Tabs() {
    const pipelines = useAccurateContext(ProjectContext);

    return (
        <div>
            {pipelines.map((p) => (
                <Link key={p.id} href={`/d/${p.project_id}/${p.id}`}>
                    {p.name}
                </Link>
            ))}
        </div>
    );
}
