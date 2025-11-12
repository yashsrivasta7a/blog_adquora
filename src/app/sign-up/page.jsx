"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage({ searchParams }) {
  const redirect = searchParams?.redirect_url || "/";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <SignUp afterSignUpUrl={redirect} routing="path" path="/sign-up" />
      </div>
    </div>
  );
}
