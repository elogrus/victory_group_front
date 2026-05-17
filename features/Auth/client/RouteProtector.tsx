"use client";

import { ReactNode } from "react";
import { useProtectRoute } from "./useProtectRoute";

export function RouteProtector({ children }: { children: ReactNode }) {
    useProtectRoute();
    return children;
}
