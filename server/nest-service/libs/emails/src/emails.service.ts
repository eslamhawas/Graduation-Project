import {
  IEmail,
  MailDataRequired,
} from '@app/backend-core/interfaces/mail-interfaces.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailsService {

  constructor(
    private config: ConfigService,
    @Inject('MAIL_TRANSPORTER')
    private transporter: nodemailer.Transporter,
  ) {}

  // async sendEmail({ from, to, subject }: IEmail) {
  //   const msg: MailDataRequired = {
  //     from: from || this.config.get<string>('emails.user'),
  //     to,
  //     subject,
  //     text,
  //   };
  //   return this.transporter.mailService.send(msg);
  // }

  async sendRawEmail({ from, to, subject, text }: IEmail) {
    const msg: MailDataRequired = {
      from: from || this.config.get<string>('emails.user'),
      to,
      subject,
      text,
    };
    return await this.transporter?.sendMail(msg);
  }
}
