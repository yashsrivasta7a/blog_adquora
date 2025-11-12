"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage({ searchParams }) {
  const redirect = searchParams?.redirect_url || "/";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <SignIn afterSignInUrl={redirect} routing="path" path="/sign-in" />
      </div>
    </div>
  );
}
