import { CONSTS } from "@/shared/lib/consts";
import { myFetch } from "@/shared/lib/myFetch";
import { Pipeline } from "./Pipeline";

export type Column = {
    id: number;
    Column_id: number;
    name: string;
    order: number;
};

class ColumnService {
    private ROUTES = {
        default: (pipelineId: Pipeline["id"]) =>
            CONSTS.API_URL + `/pipelines/${pipelineId}/columns`,
        column_id: (pipelineId: Pipeline["id"], columnId: Column["id"]) =>
            CONSTS.API_URL + `/pipelines/${pipelineId}/columns/${columnId}`,
    };
    async getList(pipelineId: Pipeline["id"]) {
        return await myFetch<Column[]>(this.ROUTES.default(pipelineId), {
            method: "GET",
        });
    }
    async create(pipelineId: Pipeline["id"], fields: Omit<Column, "id">) {
        return await myFetch<{
            detail: string;
            column: Column;
        }>(this.ROUTES.default(pipelineId), {
            method: "POST",
            body: JSON.stringify(fields),
        });
    }
    async update(
        pipelineId: Pipeline["id"],
        columnId: Column["id"],
        fields: Partial<Column>,
    ) {
        return await myFetch<{
            detail: string;
            column: Column;
        }>(this.ROUTES.column_id(pipelineId, columnId), {
            method: "PATCH",
            body: JSON.stringify(fields),
        });
    }
    async delete(pipelineId: Pipeline["id"], columnId: Column["id"]) {
        return await myFetch<{
            detail: string;
        }>(this.ROUTES.column_id(pipelineId, columnId), {
            method: "DELETE",
        });
    }
}
const columnService = new ColumnService();
export default columnService;
