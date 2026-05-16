import { Pipeline } from "./Pipeline";
import { Project } from "./Project";

export type AutomationRule = {
    id: number;
    project_id: number;
    name: string;
    trigger: string;
    conditions: string[];
    actions: string[];
    enabled: boolean;
    created_at: string;
};

class AutomationRuleService {
    async getList(projectId: Project["id"]) {}
    async create(projectId: Project["id"]) {}
    async update(projectId: Project["id"], ruleId: AutomationRule["id"]) {}
    async delete(projectId: Project["id"], ruleId: AutomationRule["id"]) {}
}
const automationRuleService = new AutomationRuleService();
export default automationRuleService;
