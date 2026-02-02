"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "../prisma";

type AppointmentJoined = Prisma.AppointmentGetPayload<{
  include: {
    user: {
      select: {
        firstName: true;
        lastName: true;
        email: true;
      };
    };
    doctor: {
      select: {
        name: true;
        imageUrl: true;
      };
    };
  };
}>;

export async function getAllAppointments() {
  try {
    const appointments: AppointmentJoined[] = await prisma.appointment.findMany(
      {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          doctor: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    );
    return appointments;
  } catch (error) {
    console.error("Error trying to fetch appointments", error);
    throw new Error("Failed to get appointments");
  }
}
