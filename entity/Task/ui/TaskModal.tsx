import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Eye, ThumbsUp, Share2, MoreHorizontal, X, Paperclip, Link, User, Zap, ChevronDown, CheckSquare } from "lucide-react";

export function TaskModal({ task, isOpen, onClose }: any) {
    if (!task) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[80vw] w-[80vw] h-[90vh] flex flex-col p-0 bg-background border-border shadow-2xl overflow-hidden rounded-xl [&>button]:hidden">
                <div className="flex items-center justify-between px-8 py-5 border-b shrink-0">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="bg-blue-100 text-blue-600 p-1 rounded"><CheckSquare className="w-4 h-4" /></div>
                        <span className="text-muted-foreground hover:underline cursor-pointer">{task.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground"><Eye className="w-4 h-4 mr-2" /> 1</Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground"><ThumbsUp className="w-4 h-4 mr-2" /> 1</Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground"><Share2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground ml-2" onClick={onClose}><X className="w-5 h-5" /></Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Левая часть */}
                    <div className="flex-1 overflow-y-auto p-8 pt-6 pr-12 flex flex-col gap-8">
                        <div>
                            <h1 className="text-[28px] font-semibold text-foreground mb-6">{task.title}</h1>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="bg-muted/50 font-medium"><Paperclip className="w-4 h-4 mr-2" /> Вложить</Button>
                                <Button variant="secondary" className="bg-muted/50 font-medium"><Zap className="w-4 h-4 mr-2" /> Добавить подзадачу</Button>
                                <Button variant="secondary" className="bg-muted/50 font-medium"><Link className="w-4 h-4 mr-2" /> Связать задачу <ChevronDown className="w-4 h-4 ml-1" /></Button>
                                <Button variant="ghost" size="icon" className="bg-muted/50"><MoreHorizontal className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-[15px] mb-3">Описание</h3>
                            <div className="text-[15px] text-muted-foreground cursor-text hover:bg-muted/30 p-2 rounded -ml-2 transition-colors">
                                {task.description || "Добавьте описание..."}
                            </div>
                        </div>

                        {/* Подзадачи */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-[15px]">Подзадачи</h3>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-muted-foreground">Сортировка ▼</span>
                                </div>
                            </div>
                            <div className="h-1 bg-muted rounded-full w-full mb-4"><div className="h-full bg-green-500 w-[30%] rounded-full"></div></div>
                            <div className="border rounded-lg border-border/50 divide-y divide-border/50 bg-card">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/20 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <CheckSquare className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm hover:underline">{task.id}-{i}</span>
                                            <span className="text-sm">Дизайн секции {i}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px]">SL</div>
                                            <span className="text-[11px] font-bold bg-muted px-2 py-1 rounded">TO DO <span>▼</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Активность */}
                        <div>
                            <h3 className="font-semibold text-[15px] mb-4">Активность</h3>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">DK</div>
                                <div className="flex-1 border rounded-lg p-3 text-sm text-muted-foreground bg-card shadow-sm cursor-text hover:bg-muted/10 transition-colors">
                                    Добавить комментарий...
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая часть (Детали) */}
                    <div className="w-[420px] shrink-0 p-8 pt-6 border-l flex flex-col gap-6 overflow-y-auto bg-muted/10">
                        <Button className="bg-muted text-foreground hover:bg-muted/80 font-semibold border shadow-sm w-fit">
                            К выполнению <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>

                        <div className="border rounded-lg bg-card shadow-sm p-4">
                            <h4 className="font-semibold text-[15px] mb-4">Детали</h4>
                            <div className="grid grid-cols-[130px_1fr] items-center gap-y-5 text-sm">
                                <div className="text-muted-foreground">Исполнитель</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"><User className="w-4 h-4" /></div>
                                    <a href="#" className="text-blue-600 text-xs hover:underline">Назначить мне</a>
                                </div>
                                <div className="text-muted-foreground">Автор</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">DK</div>
                                    Diniar Karimov
                                </div>
                                <div className="text-muted-foreground">Приоритет</div>
                                <div className="flex items-center gap-2 text-red-500 font-bold"><span className="text-lg leading-none">^</span> Highest</div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}