import { z } from "zod";

export const schoolRegistrationSchema = z.object({
  schoolName: z.string().trim().min(1, "School name is required"),
  address: z.string().optional(),
  place: z.string().trim().min(1, "Place is required"),
  district: z.string().trim().min(1, "District is required"),
  pinCode: z.string().optional(),
  state: z.string().default("Andhra Pradesh"),
  country: z.string().default("India"),
  phone: z.string().optional(),
  email: z.string().trim().email("Invalid email").or(z.literal("")),
  principalName: z.string().optional(),
  mobile: z.string().trim().min(10, "Invalid mobile number"),
  examMode: z.array(z.enum(["Online", "Offline"])).min(1, "Select at least one exam mode")
});
