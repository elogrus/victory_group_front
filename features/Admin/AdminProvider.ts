"use client";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useEffect } from "react";
import { clear, fetchProjects, fetchUsers } from "./slice";

export function AdminProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchUsers());
        return () => {
            dispatch(clear());
        };
    }, []);

    return children;
}
