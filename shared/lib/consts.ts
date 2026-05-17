export const CONSTS = {
    API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost",
    API_WS_URL: process.env.NEXT_PUBLIC_API_WS_URL ?? "ws://localhost",
} as const;
