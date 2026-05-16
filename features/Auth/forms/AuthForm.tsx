"use client";
import meService from "@/entity/Me";
import { cn } from "@/shared/lib/utils";
import { emailSchema } from "@/shared/schemes/emailSchema";
import { Button } from "@/shared/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    login: z.string(),
    password: z.string(),
});

export function AuthForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm({
        resolver: zodResolver(formSchema),

        defaultValues: {
            login: "",
            password: "",
        },
    });
    const router = useRouter();
    return (
        <form
            onSubmit={handleSubmit(async (data) => {
                const res = await meService.login(data.login, data.password);
                if (res.ok) {
                    router.push("/d");
                } else {
                    toast.error(
                        res.errors[0] || "Произошла ошибка. Попробуйте позже.",
                    );
                }
            })}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Вход в аккаунт</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Описание бла бла
                    </p>
                </div>
                <Field data-invalid={!!errors.login}>
                    <FieldLabel htmlFor="login">Логин</FieldLabel>
                    <Input
                        id="login"
                        placeholder="email@example.com"
                        {...register("login")}
                    />
                    {errors.login && (
                        <FieldDescription>
                            {errors.login.message}
                        </FieldDescription>
                    )}
                </Field>
                <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <FieldDescription>
                            {errors.password.message}
                        </FieldDescription>
                    )}
                </Field>

                <Field>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner /> : "Войти"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
