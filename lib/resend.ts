import { Resend } from 'resend';

const resendInstance = new Resend(process.env.RESEND!);

export default resendInstance;
