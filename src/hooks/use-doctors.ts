"use client";

import {
  createDoctor,
  getAllDoctors,
  updateDoctor,
} from "@/lib/actions/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFetchAllDoctors() {
  const result = useQuery({
    queryKey: ["fetchAllDoctors"],
    queryFn: getAllDoctors,
  });
  return result;
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  const doctor = useMutation({
    mutationFn: createDoctor,
    onSuccess() {
      console.log("Doctor created");
      queryClient.invalidateQueries({
        queryKey: ["fetchAllDoctors"],
      });
    },
    onError() {
      console.error("Doctor creation failed");
    },
  });

  return doctor;
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  const updatedDoctor = useMutation({
    mutationFn: updateDoctor,
    onSuccess() {
      console.log("Doctor updated");
      queryClient.invalidateQueries({
        queryKey: ["fetchAllDoctors"],
      });
    },
    onError() {
      console.error("Doctor creation failed");
    },
  });
  return updatedDoctor;
}
