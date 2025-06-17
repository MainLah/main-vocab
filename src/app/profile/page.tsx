"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      <div className="min-h-screen md:flex bg-neutral-950 ">
        <Card className="md:h-screen bg-neutral-900 border-none shadow-xl md:w-1/3 md:sticky md:left-0 md:top-0 md:py-24">
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
        <div className="h-[1000px]"></div>
      </div>
    );
  } else {
    router.push("/");
  }
};

export default ProfilePage;
