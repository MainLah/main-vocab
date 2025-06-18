"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { APIResponse } from "@/types/type";
import { Navbar1 } from "@/components/NavBar";

const ProfilePage = () => {
  const [favorites, setFavorites] = useState<APIResponse[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    const fetchFavorites = async () => {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      const vocabData = await Promise.all(
        data.data.map(async (fav: { vocab_id: number }) => {
          const res = await fetch(`/api/vocab/${fav.vocab_id}`);
          return res.json();
        })
      );
      setFavorites(vocabData);
    };
    fetchFavorites();
  }, [session]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vocab_id: id }),
      });
      if (res.ok) {
        setFavorites(favorites.filter((e) => e.id !== id));
      }
    } catch (error) {
      return <div>ERROR: {(error as unknown as Error).message}</div>;
    }
  };

  if (status === "loading")
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="scroll-m-20 text-center text-4xl tracking-tight text-balance">
          Loading...
        </h1>
      </div>
    );

  if (session) {
    return (
      <>
        <Navbar1></Navbar1>
        <div className="min-h-screen md:flex md:gap-4 bg-neutral-950 pt-5">
          <Card className="md:h-screen bg-neutral-900 border-none shadow-xl md:min-w-1/4 md:sticky md:left-0 md:top-0 md:py-24">
            <h1 className="text-neutral-100 text-4xl text-center p-0 m-0 md:pb-10 hidden md:block">
              Profile
            </h1>
            <CardHeader className="flex items-center gap-4 md:flex-col md:items-center md:justify-center md:gap-15">
              <img
                src={session?.user?.image ?? undefined}
                alt="Profile Picture"
                className="rounded-full w-15 md:w-48"
              />
              <div className="flex flex-col gap-3">
                <CardTitle className="text-neutral-100 md:text-center">
                  {session?.user?.name}
                </CardTitle>
                <CardDescription className="text-neutral-100 md:text-center">
                  {session?.user?.email}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <div className="min-h-screen flex flex-col justify-center">
            <h1 className="text-neutral-100 text-3xl md:text-4xl py-4 m-4 md:m-0">
              Your Favorite Words :
            </h1>
            <div className="md:flex md:flex-wrap md:gap-5">
              {favorites.map((vocab) => (
                <Card
                  className="p-4 min-w-50 rounded-xl m-4 md:m-0"
                  key={vocab.id}
                >
                  {vocab && (
                    <>
                      <CardHeader>
                        <CardTitle>{vocab.word}</CardTitle>
                        <CardDescription>
                          {vocab.phonetic
                            ? vocab.phonetic
                            : "No phonetic reading available"}
                        </CardDescription>
                        <CardAction>
                          <Button
                            className="cursor-pointer"
                            onClick={() => handleDelete(vocab.id)}
                          >
                            <img
                              className="invert w-4"
                              src="/delete-svgrepo-com.svg"
                              alt="Delete"
                            />
                          </Button>
                        </CardAction>
                      </CardHeader>
                      <p className="px-6">Definitions: </p>
                      {vocab.part_of_speech?.map(
                        (part: string, index: number) => (
                          <div key={index}>
                            <CardContent>
                              <p>
                                {++index}. As{" "}
                                {part === "adjective" ? "an " : "a "}
                                <strong>{part}</strong>
                              </p>
                            </CardContent>
                            <CardFooter>
                              <p className="break-words whitespace-pre-line">
                                {vocab.definitions?.[index]}
                              </p>
                            </CardFooter>
                          </div>
                        )
                      )}
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    router.push("/");
  }
};

export default ProfilePage;
