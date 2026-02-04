"use client";

import {
  getAllAppointments,
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
