interface BaseFetchResult {
    ok: boolean;
    status: number;
    res: Response;
    errors: string[];
}
export interface FetchResultSuccess<T> extends BaseFetchResult {
    ok: true;
    body: T;
}
export interface FetchResultFailure extends BaseFetchResult {
    ok: false;
    body?: never;
}

export type FetchResult<T = unknown> =
    | FetchResultSuccess<T>
    | FetchResultFailure;

export const myFetch = async <T = unknown>(
    ...args: Parameters<typeof fetch>
): Promise<FetchResult<T>> => {
    const res = await fetch(...args);

    if (res.status === 401) {
        console.log("dispatch event");
        const event = new CustomEvent("accessDenied");
        document.dispatchEvent(event);
    }

    if (res.ok) {
        const result: FetchResult<T> = {
            ok: true,
            status: res.status,
            res: res,
            errors: [],
            body: res.bodyUsed ? await res.json() : null,
        };
        return result;
    }

    const result: FetchResult<T> = {
        ok: res.ok,
        status: res.status,
        res: res,
        errors: res.bodyUsed ? ((await res.json()) as string[]) : [],
    };

    return result;
};
