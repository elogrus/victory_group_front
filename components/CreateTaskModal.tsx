import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, X } from "lucide-react";

export function CreateTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[80vw] w-[80vw] h-[90vh] flex flex-col p-0 bg-background border-border shadow-2xl overflow-hidden rounded-xl [&>button]:hidden">
                <div className="flex items-center justify-between px-8 py-4 border-b shrink-0">
                    <h2 className="text-xl font-semibold text-foreground">Создание задачи</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground"><Eye className="w-4 h-4" /></Button>
                        {/* Оставляем только эту кнопку закрытия */}
                        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onClose}><X className="w-5 h-5" /></Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-[2] overflow-y-auto p-8 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-foreground flex items-center gap-1">Раздел <span className="text-red-500">*</span></label>
                                <select className="w-full mt-2 bg-muted/20 border rounded-md p-2.5 text-sm outline-none focus:border-blue-500">
                                    <option>VictoryGroup (KAN)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-foreground flex items-center gap-1">Тип задачи <span className="text-red-500">*</span></label>
                                <select className="w-full mt-2 bg-muted/20 border rounded-md p-2.5 text-sm outline-none focus:border-blue-500">
                                    <option>✓ Задача</option>
                                    <option>⚡ Epic</option>
                                </select>
                            </div>
                        </div>

                        <hr className="border-border/50" />

                        <div>
                            <label className="text-sm font-semibold text-foreground">Статус</label>
                            <select className="w-1/3 mt-2 bg-muted/20 border rounded-md p-2.5 text-sm outline-none focus:border-blue-500 block">
                                <option>К выполнению</option>
                                <option>В работе</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground flex items-center gap-1">Резюме <span className="text-red-500">*</span></label>
                            <Input className="mt-2 bg-muted/10 focus:border-blue-500 h-10" placeholder="Краткое описание" />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Описание</label>
                            <div className="border rounded-md overflow-hidden bg-muted/10 focus-within:border-blue-500">
                                <textarea className="w-full p-4 text-sm min-h-[150px] outline-none bg-transparent" placeholder="Добавьте подробное описание задачи..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex-[1] bg-muted/10 border-l p-8 overflow-y-auto flex flex-col gap-6">
                        <div>
                            <label className="text-sm font-semibold text-foreground flex justify-between">Исполнитель <a href="#" className="text-blue-600 font-normal hover:underline">Назначить себе</a></label>
                            <select className="w-full mt-2 bg-background border rounded-md p-2.5 text-sm outline-none">
                                <option>👤 Автоматически</option>
                                <option>DK Diniar Karimov</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground">Приоритет</label>
                            <select className="w-full mt-2 bg-background border rounded-md p-2.5 text-sm outline-none">
                                <option>Highest</option>
                                <option>High</option>
                                <option>Medium</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground">Срок исполнения</label>
                            <Input type="date" className="mt-2 bg-background" />
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 border-t flex items-center justify-between bg-background shrink-0">
                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input type="checkbox" className="rounded border-border w-4 h-4" /> Создать еще одну
                    </label>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose}>Отмена</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onClose}>Создать</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}