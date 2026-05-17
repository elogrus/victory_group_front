"use client";

import tokenService from "@/entity/Token";
import { useRouter } from "next/navigation";

export function useProtectRoute() {
    const router = useRouter();
    const token = tokenService.getToken();

    if (!token) {
        router.replace("/auth");
    }
}
