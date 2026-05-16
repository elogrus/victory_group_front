import { AuthProvider } from "@/features/Auth/client/AuthProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/shared/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Vira",
    description: "Event-driven Kanban",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Добавлен класс "dark" для принудительной темной темы
        <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
            <body className={inter.className}>
                <AuthProvider>{children}</AuthProvider>
                <Toaster
                    position="top-center"
                    toastOptions={{ duration: 4000 }}
                />
            </body>
        </html>
    );
}
