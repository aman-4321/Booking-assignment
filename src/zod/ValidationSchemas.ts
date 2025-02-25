import { z } from "zod";

export const createBookingBody = z.object({
  groundId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ground ID"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (date) => new Date(date) >= new Date(),
      "Date must be in the future"
    ),
  timeSlot: z.object({
    start: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
    end: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingBody>;
