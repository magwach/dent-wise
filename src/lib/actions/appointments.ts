"use server";

import { AppointmentStatus, Prisma } from "@/generated/prisma/client";
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

export async function updateAppointmentStatus(appointmentData: {
  id: string;
  status: AppointmentStatus;
}) {
  try {
    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentData.id,
      },
    });

    if (!existingAppointment) throw new Error("Appointment not found");

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentData.id,
      },
      data: {
        status: appointmentData.status,
      },
    });

    return updatedAppointment;
  } catch (error) {
    console.error("Failed to update the appointment: ", error);
    throw new Error("Error updating the appointment");
  }
}
