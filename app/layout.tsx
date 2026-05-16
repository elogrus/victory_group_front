import { AuthProvider } from "@/features/Auth/client/AuthProvider";
import "./globals.css";
import { Toaster } from "@/shared/ui/sonner";

export const metadata = {
    title: "Victory Group",
    description: "Event-driven Kanban",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
            <body className="font-sans">
                <AuthProvider>{children}</AuthProvider>
                <Toaster
                    position="top-center"
                    toastOptions={{ duration: 4000 }}
                />
            </body>
        </html>
    );
}
