import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "../lib/data";
import { Share2, MoreHorizontal, Link, Paperclip, Eye, Zap, User } from "lucide-react";

export function TaskModal({ task, isOpen, onClose }: { task: Task | null; isOpen: boolean; onClose: () => void }) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] w-[95vw] h-[90vh] flex flex-col p-0 bg-background border-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Добавить epic</span> / <span className="text-blue-500 font-medium flex items-center gap-1"><Zap className="w-3 h-3"/> {task.id}</span>
          </div>
          <div className="flex items-center gap-1 pr-8"> {/* pr-8 чтобы не наехать на дефолтный крестик */}
            <Button variant="ghost" size="sm" className="text-muted-foreground"><Eye className="w-4 h-4 mr-2"/> 1</Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground"><Share2 className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-4">{task.title}</h1>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm"><Paperclip className="w-4 h-4 mr-2"/> Прикрепить</Button>
                <Button variant="secondary" size="sm"><Link className="w-4 h-4 mr-2"/> Связать задачу</Button>
                <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Описание</h3>
              <div className="text-sm text-muted-foreground cursor-pointer hover:bg-muted/50 p-3 rounded -ml-3">
                {task.description || "Редактировать описание"}
              </div>
            </div>
            {/* Остальной код подзадач и активности из прошлого ответа */}
          </div>

          <div className="w-[400px] bg-muted/10 border-l p-6 overflow-y-auto flex flex-col gap-6 shrink-0">
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-between">
                {task.status === 'todo' ? 'К выполнению' : task.status === 'in-progress' ? 'В работе' : 'Готово'} 
                <span className="text-xs">▼</span>
              </Button>
            </div>
            <div className="border rounded-md p-4 flex flex-col gap-4 bg-card">
              <h4 className="font-semibold text-sm flex items-center justify-between">Сведения <MoreHorizontal className="w-4 h-4"/></h4>
              <div className="grid grid-cols-[120px_1fr] items-center gap-y-4 text-sm">
                <div className="text-muted-foreground">Исполнитель</div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"><User className="w-3 h-3"/></div> Не назначено</div>
                <div className="text-muted-foreground">Приоритет</div>
                <div>{task.priority}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}