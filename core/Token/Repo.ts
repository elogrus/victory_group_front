import { AbstractReturn } from "@/lib/utils";

export type Token = string;
export abstract class TokenRepo {
    abstract getToken(): AbstractReturn<Token | null>;
}
