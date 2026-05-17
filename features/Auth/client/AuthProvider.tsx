"use client";

import tokenService from "@/entity/Token";
import { useRouter } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    useLayoutEffect(() => {
        const listener = () => {
            router.push("/auth");
        };
        document.addEventListener("accessDenied", listener);
        return () => {
            document.removeEventListener("accessDenied", listener);
        };
    }, [router]);

    return <>{children}</>;
}
