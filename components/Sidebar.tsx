import { ChevronLeft, ChevronRight, FolderDot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside className={`relative border-r bg-muted/10 transition-all duration-300 flex flex-col shrink-0 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4 flex items-center justify-between border-b h-14">
        {isOpen && <span className="font-semibold text-sm text-muted-foreground">Проекты</span>}
        {isOpen && <Button variant="ghost" size="icon" className="w-6 h-6"><Plus className="w-4 h-4"/></Button>}
      </div>
      
      <nav className="p-2 flex-1 flex flex-col gap-1 overflow-hidden">
        {/* Активный проект */}
        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-muted/50 text-primary rounded-md text-sm font-medium whitespace-nowrap">
          <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-xs font-bold text-black shrink-0">V</div>
          {isOpen && <span>VictoryGroup</span>}
        </a>
        
        {/* Другие проекты */}
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/30 hover:text-primary rounded-md text-sm font-medium whitespace-nowrap mt-2">
          <FolderDot className="w-5 h-5 shrink-0" />
          {isOpen && <span>Landing page</span>}
        </a>
      </nav>

      {/* Кнопка сворачивания */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 w-6 h-6 bg-background border rounded-full flex items-center justify-center shadow-sm hover:bg-muted z-10"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}