// lib/ky.ts
import TokenService from "@/core/Token/Service";
import ky from "ky";

const tokenService = new TokenService();

export const apiClient = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    retry: 0, // отключаем встроенные ретраи, будем управлять сами
    hooks: {
        afterResponse: [
            async ({ request, response, retryCount }) => {
                if (response.status === 401 && retryCount === 0) {
                    return ky.retry({
                        request: new Request(request, { headers }),
                        code: "TOKEN_REFRESHED",
                    });
                }
            },
        ],
    },
});
