import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const MAIL_TRANSPORTER = 'MAIL_TRANSPORTER';

export const MailProvider: Provider = {
  provide: MAIL_TRANSPORTER,
  useFactory: (config: ConfigService) => {
    return nodemailer.createTransport({
      service: config.get<string>('email.service'),
      auth: {
        user: config.get<string>('email.user'),
        pass: config.get<string>('email.pass'),
      },
    });
  },
  inject: [ConfigService], // 👈 Inject ConfigService into useFactory
};
