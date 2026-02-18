"use server";

import { AppointmentStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "../prisma";
import { auth } from "@clerk/nextjs/server";

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

export interface BookAppointmentInput {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

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

export async function getUserAppointmentStats(): Promise<
  | {
      totalAppointments: number;
      completedAppointments: number;
    }
  | undefined
> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not Authenticated");

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) throw new Error("User not found");

    const [totalCount, completedCount] = await Promise.all([
      prisma.appointment.count({ where: { userId: user.id } }),
      prisma.appointment.count({
        where: { userId: userId, status: "COMPLETED" },
      }),
    ]);
    return {
      totalAppointments: totalCount,
      completedAppointments: completedCount,
    };
  } catch (error) {
    console.error("Failed to fetch appointment stats: ", error);
    return { totalAppointments: 0, completedAppointments: 0 };
  }
}

export async function getUserAppointments() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not Authenticated");
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error("User not found");

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: user.id,
      },
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
      orderBy: [
        {
          date: "asc",
        },
        { time: "asc" },
      ],
    });
    return appointments;
  } catch (error) {
    console.error("Failed to fetch user appointments: ", error);
    throw new Error("Error fetching user appointments");
  }
}

export async function getBookedTimeSlots(doctorId: string, date: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: new Date(date),
        status: {
          in: ["COMPLETED", "CONFIRMED"],
        },
      },
      select: { time: true },
    });

    return appointments.map((appointment) => appointment.time);
  } catch (error) {
    console.error("Failed to fetch booked time slots ", error);
    return [];
  }
}

export async function bookAppointment(input: BookAppointmentInput) {
  try {
    const { userId } = await auth();
    if (!userId)
      throw new Error("You must be authenticated to book appointment");
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error("User not found");

    if (!input.date || !input.doctorId || !input.time) {
      throw new Error("Doctor, date and time are required");
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        date: new Date(input.date),
        time: input.time,
        reason: input.reason || "General Consultation",
        doctorId: input.doctorId,
        status: "CONFIRMED",
      },
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
    });
    return appointment;
  } catch (error) {
    console.error("Failed to book appointments: ", error);
    throw new Error("Error booking appointments");
  }
}
