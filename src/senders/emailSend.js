import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jeanne.considine54@ethereal.email',
        pass: 'ayBcx3z8FAuYNJGz2v'
    }
});

export { transporter };
