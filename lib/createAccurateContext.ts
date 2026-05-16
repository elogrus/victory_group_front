import { createContext } from "react";

export default function createAccurateContext<T>() {
    return createContext<T | null>(null);
}
