"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function toCapitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function HomePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-vocab");
      const data = await res.json();
      setData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const vocab = data[0];

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-4">
        <Card className="px-4 min-w-50 rounded-xl">
          {vocab && (
            <>
              <CardHeader>
                <CardTitle>
                  {loading
                    ? "Loading..."
                    : vocab
                    ? toCapitalize(vocab.word)
                    : "No data found"}
                </CardTitle>
                <CardDescription>
                  {vocab.phonetic
                    ? vocab.phonetic
                    : "No phonetic reading available"}
                </CardDescription>
              </CardHeader>
              <p className="px-6">Definitions: </p>
              {vocab.part_of_speech?.map((part: string, index: number) => (
                <div key={index}>
                  <CardContent>
                    <p>
                      {++index}. As {part === "adjective" ? "an " : "a "}
                      <strong>{part}</strong>
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="break-words whitespace-pre-line">
                      {vocab.definitions?.[index]}
                    </p>
                  </CardFooter>
                </div>
              ))}
            </>
          )}
        </Card>
        <Button
          size="lg"
          className="rounded-lg px-8 text-lg mt-4 bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate more!"}
        </Button>
      </div>
    </main>
  );
}
