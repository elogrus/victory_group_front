import tokenService from "@/core/Token/Service";
import { redirect } from "next/navigation";

const redirectToAuth = () => redirect("/auth");

export async function ProtectRoute() {
    const token = await tokenService.getToken();

    if (!token) return redirectToAuth();

    if (!(await tokenService.veryfyToken())) return redirectToAuth();
}
