"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет вызов API FastAPI
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 bg-card border shadow-lg rounded-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded text-white flex items-center justify-center text-xl font-bold">J</div>
          </div>
          <h1 className="text-2xl font-semibold">Войти в систему</h1>
          <p className="text-sm text-muted-foreground mt-2">Введите логин/email и пароль</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Логин</label>
            <Input 
              placeholder="user@example.com" 
              value={login} 
              onChange={e => setLogin(e.target.value)} 
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Пароль</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}