import * as z from "zod";

export const registrationSchema = z.object({
  username: z.string().min(3, "Name must be 3+ characters"),
  email: z.string().email("Invalid email"),
  // If this line exists, but isn't in your form, it will fail!
  grade: z.string().min(1, "Please select a grade"), 
});

export type RegistrationValues = z.infer<typeof registrationSchema>;