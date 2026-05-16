export type Notification = {
    id: number;
    user_id: number;
    project_id: number;
    type: string;
    payload: Record<string, unknown>;
    read: boolean;
    created_at: string;
};

class NotificationService {
    async getList() {}
    async markRead(id: Notification["id"]) {}
    async markAllRead() {}
}
const notificationService = new NotificationService();
export default notificationService;
