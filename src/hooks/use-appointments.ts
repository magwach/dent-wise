"use client";

import {
  bookAppointment,
  BookAppointmentInput,
  getAllAppointments,
  getUserAppointments,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function fetchAllAppointments() {
  const appointments = useQuery({
    queryKey: ["fetchAllAppointments"],
    queryFn: getAllAppointments,
  });
  return appointments;
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["fetchAllAppointments"],
      });
    },
  });

  return result;
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllAppointments"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return result;
}

export function useUserAppointments() {
  const result = useQuery({
    queryKey: ["getUserAppointments"],
    queryFn: getUserAppointments,
  });
  return result;
}
