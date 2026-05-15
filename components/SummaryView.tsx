import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryView() {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto pb-10">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        {['Выполнено: 2', 'Обновлено: 5', 'Создано: 5', 'К скорому выполнению: 0'].map((title, i) => (
          <Card key={i} className="bg-muted/20 border-border/50">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><div className="w-8 h-8 rounded bg-muted"></div> {title}</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4 text-xs text-muted-foreground">за последние 7 дней</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Chart Mock */}
        <Card className="bg-muted/10 border-border/50 h-64">
          <CardHeader><CardTitle className="text-sm">Сводка статусов</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center relative h-32 mt-4">
            <div className="w-32 h-32 rounded-full border-[16px] border-blue-500 border-t-green-500 border-r-purple-500"></div>
            <div className="absolute text-center"><div className="text-2xl font-bold">5</div><div className="text-xs text-muted-foreground">Всего задач</div></div>
          </CardContent>
        </Card>

        {/* Activity Feed Mock */}
        <Card className="bg-muted/10 border-border/50 h-64 overflow-y-auto">
          <CardHeader><CardTitle className="text-sm">Недавняя активность</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs">DK</div>
                <div>
                  <div className="text-muted-foreground">Пользователь обновил поле в задаче <span className="text-blue-400">KAN-{i}</span></div>
                  <div className="text-xs text-muted-foreground/50 mt-1">около 2 часов назад</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}