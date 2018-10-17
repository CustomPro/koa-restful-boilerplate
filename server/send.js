import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import mandrillTransport from 'nodemailer-mandrill-transport'
import User from './models/user'
import { connectionString } from './config'

mongoose.connect(connectionString, { useNewUrlParser: true });
mongoose.connection.on('error', console.error);

const send = async () => {
  try {
    const users = await User.find();

    users.forEach( user => {
      if(user.isnew){      
        User.findOneAndUpdate({email:user.email}, { isnew: 0 }, { new: true, runValidators: true})
          .then(async(doc) => {
            const smtpTransport = nodemailer.createTransport(mandrillTransport({
                  auth: {
                    apiKey : 'UjpcnkcWdI4ZFYykHGPAtg'
                  }
              }));
              const mailOptions={
                 from : 'services@jrni.co',
                 to : doc.email,
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
          .catch(err => {
            console.error(err)        
        });
      }
    })
  } catch (err) {
    console.log(err);
  }
}

send();



