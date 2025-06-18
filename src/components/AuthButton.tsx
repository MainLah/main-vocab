"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

type AuthButtonProps = {
  className?: string;
};

export function AuthButton({ className = "" }: AuthButtonProps) {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button
        onClick={() => signOut()}
        className={className + " cursor-pointer"}
      >
        Sign out
      </Button>
    );
  }
  return (
    <Button
      onClick={() => signIn("discord")}
      className={className + " cursor-pointer"}
    >
      Sign in with Discord
    </Button>
  );
}
