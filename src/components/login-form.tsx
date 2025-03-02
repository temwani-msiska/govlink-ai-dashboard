"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import axios from "axios";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/network/login/",
        {
          email,  // Ensure this is sending "email", NOT "username"
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      localStorage.setItem("access_token", response.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };
  
  

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-t from-sky-500 to-[#2f68bc] p-4">
      <Card className="overflow-hidden bg-white shadow-lg p-6 rounded-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 w-full" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-[#2f68bc]">Welcome</h1>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@exchange.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-center">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#2f68bc]">
                Login
              </Button>
            </div>
          </form>

          {/* GovLink Logo */}
          <div className="relative hidden md:flex flex-col items-center text-center p-6 bg-gray-100">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#2f68bc]">
              <Image
                src="/Logo Final.png"
                alt="Coat of Arms"
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mt-4 text-[#2f68bc]">GovLink AI</h1>
            <p className="text-xs lg:text-sm font-medium mt-2 text-[#2f68bc]">
              Seamless Governance, Intelligent Networks
            </p>
            <div className="absolute bottom-4 w-full text-center">
              <p className="text-xs lg:text-sm font-medium text-[#2f68bc] opacity-80">
                Powered by <span className="font-semibold">SMART Zambia</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
