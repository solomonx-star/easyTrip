// const { MailtrapClient } = require("mailtrap");
import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

export const client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};


// const recipients = [
//   {
//     email: "solomoncaster523@gmail.com",
//   },
// ];

