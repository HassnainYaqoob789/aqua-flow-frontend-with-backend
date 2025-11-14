// src/app/auth/signin/SignInForm.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import loginBgImage from "../../../../public/images/loginImageBackground.png";
import { Droplet } from "lucide-react";
import { useLogin } from "@/lib/api/servicesHooks";

const   SignInForm = () => {
  const { mutate, isPending } = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <Image src={loginBgImage} alt="Login Background" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-lg px-8">
        <div className="rounded-lg border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md md:p-12">
          <div className="text-center">
            <Droplet className="mx-auto mb-2 animate-bounce text-4xl text-blue-400" />
            <h2 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Log In to AquaFlow</h2>
            <p className="text-base text-gray-200">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10">
            <div className="mb-6">
              <label className="mb-2.5 block text-base font-medium text-white">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-lg border border-white/30 bg-white/10 py-4 pl-6 pr-12 text-white placeholder-gray-300"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2.5 block text-base font-medium text-white">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-white/30 bg-white/10 py-4 pl-6 pr-12 text-white placeholder-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg p-4 font-medium text-white"
              style={{ backgroundColor: "#1C2434" }}
            >
              {isPending ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
