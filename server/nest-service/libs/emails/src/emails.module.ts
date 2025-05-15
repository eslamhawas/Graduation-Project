import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { MailProvider } from './emails.provider';

@Module({
  providers: [EmailsService, MailProvider],
  exports: [EmailsService],
})
export class EmailsModule {}
