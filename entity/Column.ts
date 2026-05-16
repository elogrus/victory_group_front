export type Column = {
    id: number;
    Column_id: number;
    name: string;
    order: number;
};

class ColumnService {
    async getList(ColumnId: Column["id"]) {}
    async create(ColumnId: Column["id"]) {}
    async update(ColumnId: Column["id"], columnId: Column["id"]) {}
    async delete(ColumnId: Column["id"], columnId: Column["id"]) {}
}
const columnService = new ColumnService();
export default columnService;
