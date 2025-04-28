import { z } from 'zod';

export const InviteStaffSchema = z.object({
    email: z.string().email(),
    role: z.enum(['admin', 'user']),
});

type InviteStaff = {
    email: string;
    role: string;
}