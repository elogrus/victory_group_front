import { ProjectsProvider } from "@/entity/Project/provider";
import { RouteProtector } from "@/features/Auth/client/RouteProtector";
import { Header } from "@/features/Header/ui/Header";
import { Sidebar } from "@/features/Sidebar/ui/Sidebar";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RouteProtector>
            <ProjectsProvider>
                <div className="flex flex-col h-screen overflow-hidden bg-background">
                    <Header />
                    <div className="flex flex-1 overflow-hidden ">
                        <Sidebar />
                        <main className=" px-8 pt-6 pb-0 shrink-0 flex-1 flex flex-col overflow-hidden transition-all duration-300">
                            {children}
                        </main>
                    </div>
                </div>
            </ProjectsProvider>
        </RouteProtector>
    );
}
