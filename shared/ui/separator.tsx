"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/shared/lib/utils";

function Separator({
    className,
    orientation = "horizontal",
    ...props
}: SeparatorPrimitive.Props) {
    return (
        <SeparatorPrimitive
            data-slot="separator"
            orientation={orientation}
            className={cn(
                {
                    "h-px w-full": orientation === "horizontal",
                    "w-px h-full": orientation === "vertical",
                },
                "bg-border",
                className,
            )}
            {...props}
        />
    );
}

export { Separator };
