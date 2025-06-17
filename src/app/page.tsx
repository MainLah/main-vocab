"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthButton } from "@/components/AuthButton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-neutral-950 px-4">
      <Card className="w-full max-w-2xl bg-neutral-900 border-none shadow-xl rounded-xl">
        <CardContent className="flex flex-col items-center py-16 gap-6">
          <Badge className="bg-neutral-800 text-neutral-200 text-base px-4 py-1 rounded-full mb-2">
            Welcome
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-100 text-center">
            Main Vocabulary
          </h1>
          <p className="text-lg md:text-2xl text-neutral-300 text-center max-w-xl">
            Build your vocabulary with ease. Explore, learn, and master new
            words every day.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-lg px-8 text-lg mt-4 bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
          >
            <a href="/generate">Start Generating!</a>
          </Button>
          <AuthButton className="rounded-lg px-8 text-lg mt-4 bg-neutral-800 text-neutral-100 hover:bg-neutral-700"></AuthButton>
        </CardContent>
      </Card>
    </main>
  );
}
