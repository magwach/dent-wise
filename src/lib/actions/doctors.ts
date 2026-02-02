"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "../prisma";
import { Doctor, Gender } from "@/generated/prisma/browser";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

export type DoctorWithCount = Prisma.DoctorGetPayload<{
  include: {
    _count: {
      select: { appointments: true };
    };
  };
}>;

type DoctorInput = {
  name: string;
  email: string;
  phone: string;
  speciality: string;
  gender: Gender;
  isActive: boolean;
};

export async function getAllDoctors() {
  try {
    const doctors: DoctorWithCount[] = await prisma.doctor.findMany({
      include: {
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.error("Error trying to fetch doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
}

export async function createDoctor(input: DoctorInput) {
  try {
    if (!input.name || !input.email)
      throw new Error("Please provide email and name.");

    const existingDoctor = await prisma.doctor.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingDoctor) throw new Error("Email already exists");

    const doctor = await prisma.doctor.create({
      data: {
        ...input,
        imageUrl: generateAvatar(input.name, input.gender),
      },
    });
    revalidatePath("/admin");
    return doctor;
  } catch (error) {
    console.error("Error trying to add doctor:", error);
    throw new Error("Failed to create doctor");
  }
}

export async function updateDoctor(input: Doctor) {
  try {
    if (!input.name || !input.email)
      throw new Error("Please provide email and name.");

    const doctorEmail = await prisma.doctor.findUnique({
      where: {
        id: input.id,
      },
      select: {
        email: true,
      },
    });

    if (!doctorEmail) throw new Error("Doctor not found");

    if (doctorEmail.email !== input.email) {
      const existingDoctorEmail = await prisma.doctor.findUnique({
        where: {
          email: input.email,
        },
      });
      if (existingDoctorEmail) throw new Error("Email already exists");
    }

    const updatedDoctor = await prisma.doctor.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        speciality: input.speciality,
        gender: input.gender,
        isActive: input.isActive,
      },
    });
    return updatedDoctor;
  } catch (error) {
    console.error("Failde to update Doctor", error);
    throw new Error("Error updating doctor");
  }
}
