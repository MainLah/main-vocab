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
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
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
      <div
        role="status"
        className="w-full min-h-screen flex justify-center items-center"
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
    );

  if (session) {
    return (
      <>
        <Navbar1></Navbar1>
        <div className="min-h-screen md:flex md:gap-4 bg-neutral-950 pt-5">
          <Card className="bg-neutral-900 border-none shadow-xl md:min-w-1/4 md:sticky md:left-0 mt-10 md:top-0 md:py-24">
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
          <div className="min-h-full flex flex-col justify-center">
            {favorites.length > 0 && (
              <h1 className="text-neutral-100 text-3xl md:text-4xl py-4 md:pt-20 m-4 md:m-0">
                Your Favorite Words :
              </h1>
            )}
            <div className="md:flex md:flex-wrap md:gap-5">
              {isLoading ? (
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
              ) : favorites.length > 0 ? (
                favorites.map((vocab) => (
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
                                  {index + 1}. As{" "}
                                  {part === "adjective" ? "an " : "a "}
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
                          )
                        )}
                      </>
                    )}
                  </Card>
                ))
              ) : (
                <div className="flex flex-1 items-center justify-center min-h-[300px]">
                  <h1 className="text-neutral-100 mx-4 md:m-0 text-center">
                    You have no favorite words yet. Start adding some to learn!
                  </h1>
                </div>
              )}
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
