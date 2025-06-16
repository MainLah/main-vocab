import React from "react";
import { supabase } from "../../lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { count } = await supabase
    .from("vocab")
    .select("*", { count: "exact", head: true });

  if (!count || count === 0) {
    return <div>No data found. Come back later.</div>;
  }

  const randomOffset = Math.floor(Math.random() * count);

  const { data, error } = await supabase
    .from("vocab")
    .select("*")
    .range(randomOffset, randomOffset);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  function toCapitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-4">
        <Card className="px-4 min-w-50">
          <CardHeader>
            <CardTitle>{toCapitalize(data[0].word)}</CardTitle>
            <CardDescription>
              {data[0].phonetic
                ? data[0].phonetic
                : "No phonetic reading available"}
            </CardDescription>
          </CardHeader>
          <p className="px-6">Definitions: </p>
          {data[0].part_of_speech.map((part: string, index: number) => (
            <React.Fragment key={index}>
              <CardContent>
                <p>
                  {++index}. As {part === "adjective" ? "an" : "a"}{" "}
                  <strong>{part}</strong>
                </p>
              </CardContent>
              <CardFooter>
                <p>
                  {data[0].definitions[index]
                    ? data[0].definitions[index]
                    : "No definition available."}
                </p>
              </CardFooter>
            </React.Fragment>
          ))}
        </Card>
        <Button
          asChild
          size="lg"
          className="rounded-lg px-8 text-lg mt-4 bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
        >
          <a href="/generate">Generate more!</a>
        </Button>
      </div>
    </main>
  );
}
