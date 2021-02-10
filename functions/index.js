const functions = require("firebase-functions");
const nodemailer = require('nodemailer')
require('dotenv').config()
const admin = require('firebase-admin')// daje dostęp do baz aplikacji w firebase (np firestore), w rules można całkowicie wyłączyć dostęp a cloud functions i tak będzie miał dostęp 
admin.initializeApp() // inicjalizacja dostępu do baz


const cors = require('cors')({ origin: true }) // (musi być zainstalowane cors w dependences) true można zamienić na domenę np: ‘https://mydomain.com’ i wtedy tylko z tej domeny będą obsługiwane zapytania


// contains
const USERS = "users"
const PAYMENTS = "payments"
const PROMOTION = "promotion"
const ADS = "ads"


// function type: background triggers, start automatycally when new user sign up - add data about user payments in firebase 
exports.newUserSignUp = functions.auth.user().onCreate(user => {

    // make promotion points
    admin.firestore().collection(USERS).doc(user.email).collection(PAYMENTS).doc(PROMOTION).set({ points: 5 })
    // make points to add ad
    admin.firestore().collection(USERS).doc(user.email).collection(PAYMENTS).doc(ADS).set({ points: 20 })

})


// function type: onCall, func sent e-mail, in request add json with: name email message
exports.sendEmail = functions.https.onCall((data, context) => {
    let transporter = nodemailer.createTransport({
        host: 'ssl0.ovh.net',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: process.env.EMAIL, // moje konto gmail
            pass: process.env.PASSWORD // hasło do mojego konta gmail
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: process.env.TO,
        subject: 'jaTestuje.pl contact form',
        text: `Wiadomość wysłana z jaTestuje.pl z contact form: \nImię: ${data.name} \nEmail: ${data.email} \nWiadomość: ${data.message}`
    };

    return transporter.sendMail(mailOptions)
        .then(res => {
            functions.logger.log('Email sent: ', res);
            return { message: res }
        })
        .catch(err => {
            functions.logger.log('Email error: ', err)
            throw new functions.https.HttpsError('aborted', err)
        })
})

