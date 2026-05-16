import { AuthForm } from "@/features/Auth/forms/AuthForm";
import { GalleryVerticalEnd } from "lucide-react";
import LogoIcon from "@/shared/assets/logo.svg";
export default function AuthPage() {
    return (
        <div className="flex flex-col gap-30 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
                <a href="#" className="flex items-center gap-2 font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <LogoIcon className="size-4" />
                    </div>
                    Vira
                </a>
            </div>
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <AuthForm />
                </div>
            </div>
        </div>
    );
}
