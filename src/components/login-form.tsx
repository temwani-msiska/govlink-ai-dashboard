"use client";

import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter(); 

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-t from-sky-500 to-[#2f68bc] p-4">
      {/* Login Card */}
      <Card className="overflow-hidden bg-white shadow-lg p-6 rounded-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-[#2f68bc]">Welcome</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@exchange.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
                <div className="flex justify-center">
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#2f68bc]">
                Login
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => router.push("/api/auth/microsoft")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M3 3h9v9H3V3zm0 10.5h9v9H3v-9zm10.5-10.5H21v9h-7.5V3zm0 10.5H21v9h-7.5v-9z" />
                  </svg>
                  <span className="text-[#2f68bc]">Login with Microsoft Exchange</span>
                </Button>
              </div>
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
            <h1 className="text-2xl lg:text-3xl font-bold mt-4 text-[#2f68bc]">
              GovLink AI
            </h1>

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
