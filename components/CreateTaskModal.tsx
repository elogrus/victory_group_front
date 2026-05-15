import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background border-border p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Создание задачи типа «Задача»</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Раздел *</label>
            <select className="w-full mt-1 bg-muted/50 border rounded-md p-2 text-sm outline-none focus:border-blue-500">
              <option>VictoryGroup (KAN)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Резюме *</label>
            <Input className="mt-1 bg-muted/50 focus:border-blue-500" placeholder="Краткое описание" />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Описание</label>
            <textarea className="w-full mt-1 bg-muted/50 border rounded-md p-3 text-sm min-h-[120px] outline-none focus:border-blue-500" placeholder="Подробное описание задачи..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Исполнитель</label>
              <select className="w-full mt-1 bg-muted/50 border rounded-md p-2 text-sm outline-none">
                <option>Автоматически</option>
                <option>Diniar Karimov</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Приоритет</label>
              <select className="w-full mt-1 bg-muted/50 border rounded-md p-2 text-sm outline-none">
                <option>Medium</option>
                <option>High</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/20">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="rounded border-gray-300" /> Создать еще одну
          </label>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Отмена</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onClose}>Создать</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}