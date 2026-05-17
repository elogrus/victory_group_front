import tokenService from "@/entity/Token";

interface BaseFetchResult {
    ok: boolean;
    status: number;
    res: Response;
}
export interface FetchResultSuccess<T> extends BaseFetchResult {
    ok: true;
    body: T;
}
export interface FetchResultFailure extends BaseFetchResult {
    ok: false;
    errors: string[];
}

export type FetchResult<T = unknown> =
    | FetchResultSuccess<T>
    | FetchResultFailure;

export const myFetch = async <T = unknown>(
    ...args: Parameters<typeof fetch>
): Promise<FetchResult<T>> => {
    try {
        const token = tokenService.getToken();
        const url = args[0];
        const opts = args[1];
        const res = await fetch(url, {
            ...opts,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
                ...opts?.headers,
            },
            credentials: "include",
        });

        if (res.status === 401) {
            console.log("dispatch event");
            const event = new CustomEvent("accessDenied");
            document.dispatchEvent(event);
        }

        if (res.ok) {
            const body = await res.json();
            const result: FetchResult<T> = {
                ok: true,
                status: res.status,
                res: res,
                body: body ?? null,
            };
            return result;
        }

        const result: FetchResult<T> = {
            ok: res.ok,
            status: res.status,
            res: res,
            errors: res.bodyUsed
                ? ((await res.json()) as string[])
                : ["Произошла какая-то ошибка"],
        };
        return result;
    } catch (error) {
        const result: FetchResult<T> = {
            ok: false,
            res: new Response(),
            status: 500,
            errors: ["Ошибка соединения"],
        };

        return result;
    }
};
