import { ProjectsProvider } from "@/entity/Project/provider";
import { ProtectRoute } from "@/features/Auth/server/ProtectRoute";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // await ProtectRoute();

    return (
        <ProjectsProvider>
            <div className="w-full grid grid-rows-[min-content_auto] grid-cols-[240px_1fr] mx-auto">
                {children}
            </div>
        </ProjectsProvider>
    );
}
