"use client";

import { Header } from "@/features/Header/ui/Header";
import { Card, CardContent } from "@/shared/ui/card";
import { Info, Layout, CheckSquare, BarChart2, Map, Bell } from "lucide-react";
import { Button } from "@/shared/ui/button";

// Вспомогательный компонент для плейсхолдеров скриншотов
function ScreenshotPlaceholder({ text }: { text: string }) {
    return (
        <div className="w-full h-72 my-6 rounded-xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 flex flex-col items-center justify-center text-muted-foreground">
            <span className="font-semibold text-sm mb-2 opacity-50">Место для скриншота</span>
            <span className="text-sm">{text}</span>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Header />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-12 pb-20">
                    
                    {/* ЗАГОЛОВОК */}
                    <div className="text-center space-y-4 pt-8">
                        <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Info className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Добро пожаловать в систему!</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Этот краткий гайд поможет вам быстро освоиться, понять структуру проектов и научиться эффективно управлять своими задачами.
                        </p>
                    </div>

                    {/* БЛОК 1: Проекты и Доски */}
                    <Card className="bg-card shadow-sm border-border">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Layout className="w-6 h-6 text-blue-500" />
                                <h2 className="text-2xl font-bold text-foreground">1. Проекты и Доски</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Вся работа в компании разделена на <strong>Проекты</strong>. Вы можете переключаться между ними в левом боковом меню. Внутри каждого проекта может быть несколько <strong>Досок</strong> (например, для разных команд или спринтов). Переключатель досок находится прямо под названием проекта.
                            </p>
                            
                            <ScreenshotPlaceholder text="[ Скриншот: Левое боковое меню с проектами и горизонтальный список досок под заголовком ]" />
                        </CardContent>
                    </Card>

                    {/* БЛОК 2: Задачи и Канбан */}
                    <Card className="bg-card shadow-sm border-border">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckSquare className="w-6 h-6 text-green-500" />
                                <h2 className="text-2xl font-bold text-foreground">2. Работа с задачами на Канбан-доске</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                <strong>Канбан-доска</strong> — это ваш основной рабочий инструмент. Она состоит из колонок (статусов), по которым движутся задачи: от «К выполнению» до «Готово».
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                                <li><strong>Перемещение:</strong> Зажмите задачу мышкой и перетащите её в нужную колонку.</li>
                                <li><strong>Быстрое создание:</strong> Внизу каждой колонки есть кнопка «Создать задачу». Нажмите её, введите текст и нажмите Enter.</li>
                                <li><strong>Детали задачи:</strong> Кликните по карточке задачи, чтобы открыть её полное окно. Там можно изменить описание, назначить исполнителя, поменять приоритет и добавить подзадачи.</li>
                            </ul>

                            <ScreenshotPlaceholder text="[ Скриншот: Канбан доска с процессом перетаскивания задачи (Drag and Drop) ]" />
                            <ScreenshotPlaceholder text="[ Скриншот: Открытое широкое модальное окно деталей задачи ]" />
                        </CardContent>
                    </Card>

                    {/* БЛОК 3: Сводка */}
                    <Card className="bg-card shadow-sm border-border">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <BarChart2 className="w-6 h-6 text-purple-500" />
                                <h2 className="text-2xl font-bold text-foreground">3. Зачем нужна «Сводка»?</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Вкладка <strong>Сводка</strong> находится рядом с доской и списком задач. Это аналитический дашборд вашего проекта. Зайдите сюда, чтобы увидеть:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                                <li>Сколько задач было выполнено за последнюю неделю.</li>
                                <li>Графики распределения статусов и приоритетов.</li>
                                <li>Ленту последней активности коллег (кто что прокомментировал или куда перенес задачу).</li>
                            </ul>

                            <ScreenshotPlaceholder text="[ Скриншот: Вкладка Сводки с графиками и статистикой ]" />
                        </CardContent>
                    </Card>

                    {/* БЛОК 4: Карта Проектов */}
                    <Card className="bg-card shadow-sm border-border">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Map className="w-6 h-6 text-orange-500" />
                                <h2 className="text-2xl font-bold text-foreground">4. Карта проектов (Кто есть кто?)</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Если вы новичок и пока не знаете структуру компании, перейдите в <strong>Карту проектов</strong> (кнопка в самом верхнем меню). 
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Это интерактивный граф. Нажмите на карточку проекта, и она раскроется, показав все роли в проекте (например, Админы, Участники). Нажмите на роль, чтобы увидеть конкретных сотрудников и их контактные данные. Карточки можно перетаскивать по экрану для удобства чтения.
                            </p>

                            <ScreenshotPlaceholder text="[ Скриншот: Карта проектов с развернутым графом (Проект -> Роли -> Пользователи) ]" />
                        </CardContent>
                    </Card>

                    {/* БЛОК 5: Профиль и Уведомления */}
                    <Card className="bg-card shadow-sm border-border">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="w-6 h-6 text-red-500" />
                                <h2 className="text-2xl font-bold text-foreground">5. Ваш Профиль и Уведомления</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Обращайте внимание на <strong>колокольчик</strong> в правом верхнем углу. Красная точка означает, что вас упомянули в задаче или добавили в новый проект.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Кликнув по своей аватарке (кружок с инициалами) и выбрав «Профиль», вы попадете на личную страницу. Там можно сменить пароль, установить фотографию и посмотреть список всех проектов, в которых вы участвуете.
                            </p>

                            <ScreenshotPlaceholder text="[ Скриншот: Выпадающее меню уведомлений возле колокольчика ]" />
                            <ScreenshotPlaceholder text="[ Скриншот: Личная страница профиля пользователя ]" />
                        </CardContent>
                    </Card>

                    <div className="text-center pt-8">
                        <p className="text-muted-foreground mb-4">Готовы приступить к работе?</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl" onClick={() => window.location.href = '/'}>
                            Перейти к моим проектам
                        </Button>
                    </div>

                </div>
            </main>
        </div>
    );
}