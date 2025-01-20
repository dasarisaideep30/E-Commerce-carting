const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    secure : true,
    host: 'smtp.gmail.com',
    port:465,
    auth:{
        user:'dasari.saideep.s70@kalvium.community',
        pass:'ygok bnfy ewqk cfjw',
    }
})

function sendMail(to,sub,msg){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
    })
    console.log("mail sent");

}

sendMail("dasari.saideep.s70@kalvium.community","This is my subject","This is my mail working");
module.exports = transporter;