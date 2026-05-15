import { LayoutDashboard, List, Settings, FileText } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/10 hidden md:flex flex-col shrink-0">
      <div className="p-4 flex items-center gap-3 border-b">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">PR</div>
        <div>
          <div className="text-sm font-semibold">Project Board</div>
          <div className="text-xs text-muted-foreground">Software project</div>
        </div>
      </div>
      
      <nav className="p-2 flex-1 flex flex-col gap-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-muted/50 text-primary rounded-md text-sm font-medium">
          <LayoutDashboard className="w-4 h-4" /> Board
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/30 hover:text-primary rounded-md text-sm font-medium">
          <List className="w-4 h-4" /> Backlog
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/30 hover:text-primary rounded-md text-sm font-medium">
          <FileText className="w-4 h-4" /> Pages
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted/30 hover:text-primary rounded-md text-sm font-medium">
          <Settings className="w-4 h-4" /> Project settings
        </a>
      </nav>
    </aside>
  );
}