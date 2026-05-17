"use client";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useEffect } from "react";
import { clear, fetchProjects, fetchUsers, fetchRoles } from "./slice";

export function AdminProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchUsers());
        dispatch(fetchRoles());
        return () => {
            dispatch(clear());
        };
    }, [dispatch]);

    return children;
}