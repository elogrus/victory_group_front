export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: string;
  author: string;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export const COLUMNS = [
  { id: 'todo', title: 'TO DO' },
  { id: 'in-progress', title: 'IN PROGRESS' },
  { id: 'done', title: 'DONE' },
];

export const INITIAL_TASKS: Task[] = [
  { id: 'KAN-1', title: 'Задача 1', description: 'Описание первой задачи', status: 'done', priority: 'Нет', author: 'Diniar Karimov', assignee: null, createdAt: '15 мая 2026 г., 21:24', updatedAt: '15 мая 2026 г., 22:21' },
  { id: 'KAN-4', title: 'ыфываыва', description: 'Тестовая задача', status: 'todo', priority: 'Medium', author: 'Diniar Karimov', assignee: null, createdAt: '15 мая 2026 г., 22:25', updatedAt: '15 мая 2026 г., 22:25' },
  { id: 'KAN-5', title: '12321', description: 'Еще одна', status: 'todo', priority: 'Medium', author: 'Diniar Karimov', assignee: null, createdAt: '15 мая 2026 г., 22:25', updatedAt: '15 мая 2026 г., 22:25' },
  { id: 'KAN-2', title: 'Задача 2', description: 'В процессе выполнения', status: 'in-progress', priority: 'Нет', author: 'Diniar Karimov', assignee: null, createdAt: '15 мая 2026 г., 21:25', updatedAt: '15 мая 2026 г., 21:25' },
];