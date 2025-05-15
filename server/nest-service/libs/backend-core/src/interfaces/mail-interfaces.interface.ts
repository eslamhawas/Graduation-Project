export interface IEmail {
  from?: string;
  to: string;
  subject: string;
  text?: string;
}

export interface MailDataRequired {
  from?: string;
  to: string;
  subject: string;
  text?: string;
}
