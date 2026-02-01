"use client";

import { syncUser } from "@/lib/actions/users";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const handleUserSync = async () => {
      if (isSignedIn && isLoaded) {
        try {
          await syncUser();
        } catch (error) {
          console.error("Failed to sync user", error);
        }
      }
    };

    handleUserSync();
  }, [isSignedIn, isLoaded]);

  return null;
}
