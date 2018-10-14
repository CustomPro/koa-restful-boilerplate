import User from '../models/user'
import nodemailer from 'nodemailer'
import mandrillTransport from 'nodemailer-mandrill-transport'

class UsersControllers {
  /* eslint-disable no-param-reassign */

  /**
   * Get all users
   * @param {ctx} Koa Context
   */
  async find(ctx) {
    ctx.body = await User.find();
  }

  /**
   * Find a user
   * @param {ctx} Koa Context
   */
  async findById(ctx) {
    try {
      const user = await User.findById(ctx.params.id);
      if (!user) {
        ctx.throw(404);
      }
      ctx.body = user;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add a user
   * @param {ctx} Koa Context
   */
  async add(ctx) {
    try {
      const emails = await User.find({"email":ctx.request.body.email})
      if(emails.length > 0){
        ctx.body = {state:"error", message:"duplicated email"}
      } else {
        const user = await new User(ctx.request.body).save();
        var smtpTransport = nodemailer.createTransport(mandrillTransport({
            auth: {
              apiKey : 'UjpcnkcWdI4ZFYykHGPAtg'
            }
        }));
        let mailOptions={
           from : 'services@jrni.co',
           to : ctx.request.body.email,
           subject : "Welcome",
           html : "Welcome to Koa"
        };

        // Sending email.
        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error) {
             throw new Error("Error in sending email");
          }
          console.log("Message sent: " + JSON.stringify(response));
        });

        ctx.body = user;
      }
    } catch (err) {
      ctx.throw(422);
    }
  }

  /**
   * Update a user
   * @param {ctx} Koa Context
   */
  async update(ctx) {
    try {
      const user = await User.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body
      );
      if (!user) {
        ctx.throw(404);
      }
      ctx.body = user;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Delete a user
   * @param {ctx} Koa Context
   */
  async delete(ctx) {
    try {
      const user = await User.findByIdAndRemove(ctx.params.id);
      if (!user) {
        ctx.throw(404);
      }
      ctx.body = user;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /* eslint-enable no-param-reassign */
}

export default new UsersControllers();
