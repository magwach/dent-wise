"use client";

import {
  getBookedTimeSlots,
} from "@/lib/actions/appointments";
import {
  createDoctor,
  getAllDoctors,
  getAvailableDoctors,
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

export function useFetchAvailableDoctors() {
  const result = useQuery({
    queryKey: ["fetchAvailableDoctors"],
    queryFn: getAvailableDoctors,
  });
  return result;
}

export function useFetchBookedTimeSlots(doctorId: string, date: string) {
  const result = useQuery({
    queryKey: ["fetchBookedTimeSlots"],
    queryFn: () => getBookedTimeSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });
  return result;
}

