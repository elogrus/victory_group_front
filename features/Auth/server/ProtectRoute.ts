import tokenService from "@/entity/Token";
import { redirect } from "next/navigation";

const redirectToAuth = () => redirect("/auth");

export async function ProtectRoute() {
    const token = await tokenService.getToken();

    if (!token) return redirectToAuth();
}
