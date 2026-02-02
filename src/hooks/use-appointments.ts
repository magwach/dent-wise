"use client";

import { getAllAppointments } from "@/lib/actions/appointments";
import { useQuery } from "@tanstack/react-query";

export function fetchAllAppointments() {
  const appointments = useQuery({
    queryKey: ["fetchAllAppointments"],
    queryFn: getAllAppointments,
  });
  return appointments;
}
