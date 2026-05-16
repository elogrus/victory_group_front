import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import Link from "next/link";

export function AuthForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Вход в аккаунт</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Описание бла бла
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>
                    <Input id="password" type="password" required />
                </Field>
                <Field>
                    <Button type="submit">Login</Button>
                </Field>
                <FieldSeparator>или</FieldSeparator>
                <Button size="sm" variant="link">
                    <Link href="/auth/register">Зарегистрироваться</Link>
                </Button>
            </FieldGroup>
        </form>
    );
}
