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
import type { APIResponse } from "@/types/type";
import { useSession } from "next-auth/react";
import { Navbar1 } from "@/components/NavBar";

function toCapitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function HomePage() {
  const [data, setData] = useState<APIResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    if (!session) return;
    if (isFavorite) {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vocab_id: data[0].id }),
      });
      setIsFavorite(false);
    } else {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vocab_id: data[0].id }),
      });
      setIsFavorite(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-vocab");
      const data = await res.json();
      setData(data);
      const checkFavorite = await fetch(`/api/check-favorite/${data[0].id}`);
      const dataFavorite = await checkFavorite.json();
      if (dataFavorite.isFavorite) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
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
    <>
      <Navbar1></Navbar1>
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
                        {index + 1}. As {part === "adjective" ? "an " : "a "}
                        <strong>{part}</strong>
                      </p>
                    </CardContent>
                    <CardFooter>
                      <p className="break-words whitespace-pre-line">
                        {vocab.definitions?.[index]
                          ? vocab.definitions?.[index]
                          : "No definition available"}
                      </p>
                    </CardFooter>
                  </div>
                ))}
              </>
            )}
            {session && (
              <Button
                variant={isFavorite ? "destructive" : "default"}
                onClick={handleFavorite}
                className="mt-2 cursor-pointer"
              >
                {isFavorite ? "Unfavorite" : "Favorite"}
              </Button>
            )}
          </Card>
          <Button
            size="lg"
            className="rounded-lg px-8 text-lg mt-4 bg-neutral-800 text-neutral-100 hover:bg-neutral-700 cursor-pointer"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate more!"}
          </Button>
        </div>
      </main>
    </>
  );
}
