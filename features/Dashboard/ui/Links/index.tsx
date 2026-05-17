export function Links() {
    const view = "summary";
    return (
        <div className="flex gap-6 text-sm font-medium border-b border-border/50">
            <button
                className={`pb-3 border-b-2 transition-colors ${view === "summary" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}
            >
                Сводка
            </button>
            <button
                className={`pb-3 border-b-2 transition-colors ${view === "list" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}
            >
                Список
            </button>
            <button
                className={`pb-3 border-b-2 transition-colors ${view === "board" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}
            >
                Доска
            </button>
        </div>
    );
}
