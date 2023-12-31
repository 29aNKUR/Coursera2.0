import {z} from "zod";

export const signupInput = z.object({
    username: z.string().min(10).max(50).email(),
    password: z.string().min(6).max(15)
})

export type SignupParams = z.infer<typeof signupInput>;