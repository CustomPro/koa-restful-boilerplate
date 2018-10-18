import mongoose from 'mongoose'
import "babel-polyfill"
import nodemailer from 'nodemailer'
import mandrillTransport from 'nodemailer-mandrill-transport'
import User from './models/user'
import { connectionString } from './config'

mongoose.connect(connectionString, { useNewUrlParser: true });
mongoose.connection.on('error', console.error);

const send = async () => {
  try {
    const lastTimestamp = Math.floor(Date.now()) - 3600*1000;
    const users = await User.find({createdAt: {$gt: lastTimestamp}});
    
    users.forEach( user => {
      console.log(user)
      const smtpTransport = nodemailer.createTransport(mandrillTransport({
          auth: {
            apiKey : 'UjpcnkcWdI4ZFYykHGPAtg'
          }
      }));
      const mailOptions={
         from : 'services@jrni.co',
         to : user.email,
         subject : "Welcome",
         html : "Welcome to Koa"
      };
     
       // Sending email.
      smtpTransport.sendMail(mailOptions, (error,response) => {
        if(error) {
           throw new Error("Error in sending email");
        }
        console.log("Message sent: ", response);
      })
    })

  } catch (err) {
    console.log(err);
  }
}

send();



