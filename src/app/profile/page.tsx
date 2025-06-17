"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session) router.push("/");
  if (status === "loading") return <div>Loading...</div>;
  return <div>page</div>;
};

export default ProfilePage;
