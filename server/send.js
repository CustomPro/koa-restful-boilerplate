import User from './models/user'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import mandrillTransport from 'nodemailer-mandrill-transport'
import { connectionString } from './config'

mongoose.connect(connectionString);
mongoose.connection.on('error', console.error);

const send = async () => {
  try {
    const users = await User.find();

    for(var user of users) {
      if(user.isnew){      
        await User.findOneAndUpdate({_id:user._id}, { isnew: 0 }, { new: true, runValidators: true})
          .then(async(doc) => {
            var smtpTransport = nodemailer.createTransport(mandrillTransport({
                  auth: {
                    apiKey : 'UjpcnkcWdI4ZFYykHGPAtg'
                  }
              }));
              let mailOptions={
                 from : 'services@jrni.co',
                 to : user.email,
                 subject : "Welcome",
                 html : "Welcome to Koa"
              };
             
               // Sending email.
              smtpTransport.sendMail(mailOptions, function(error, response){
                if(error) {
                   throw new Error("Error in sending email");
                }
                console.log("Message sent: " + JSON.stringify(response));
                })
            })
          .catch(err => {
            console.error(err)        
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

send();



