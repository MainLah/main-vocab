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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
            {loading ? (
              <div
                role="status"
                className="w-full flex justify-center items-center"
              >
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>
                    {vocab ? toCapitalize(vocab.word) : "No data found"}
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
            {session && !loading && (
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
