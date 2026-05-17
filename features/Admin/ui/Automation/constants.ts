export const TRIGGERS = [
    { value: "task_created", label: "Задача создана" },
    { value: "task_updated", label: "Задача обновлена" },
    { value: "task_moved", label: "Задача перемещена" },
    { value: "task_deleted", label: "Задача удалена" },
    { value: "deadline_approaching", label: "Дедлайн приближается" },
    { value: "task_overdue", label: "Задача просрочена" },
];

export const CONDITION_FIELDS = [
    { value: "priority", label: "Приоритет", ops: ["eq", "neq", "gt", "lt", "between"], type: "number" },
    { value: "tags", label: "Теги", ops: ["contains", "not_contains"], type: "string" },
    { value: "column_id", label: "Колонка", ops: ["eq", "neq"], type: "select_column" },
    { value: "is_done", label: "Статус завершения", ops: ["eq", "neq"], type: "boolean" },
    { value: "title", label: "Заголовок", ops: ["eq", "neq", "contains", "not_contains"], type: "string" },
    { value: "deadline", label: "Дедлайн", ops: ["gt", "lt", "between"], type: "date" },
];

export const ACTION_TYPES = [
    { value: "move_to_column", label: "Переместить в колонку" },
    { value: "send_notification", label: "Отправить уведомление" },
    { value: "add_tag", label: "Добавить тег" },
    { value: "set_priority", label: "Установить приоритет" },
    { value: "assign_user", label: "Назначить исполнителя" },
    { value: "close_task", label: "Закрыть задачу" },
    { value: "webhook", label: "Webhook (POST запрос)" },
];