const functions = require("firebase-functions");
const nodemailer = require('nodemailer')
require('dotenv').config()
const admin = require('firebase-admin')
admin.initializeApp()



// // contains
const USERS = "users"
const ADS = "ads"
const USER_DATA = "user_data"

// // ad validation: 30days, 14days, 1day (month = 86400000 * 30 milisekund))
const AD_TIME_VALIDATION_30_DAYS = new Date().getTime() + 86400000 * 30
const AD_TIME_VALIDATION_14_DAYS = new Date().getTime() + 86400000 * 14
const AD_TIME_VALIDATION_1_DAY = new Date().getTime() + 86400000 * 1




// // function type: background triggers, start automatycally when new user sign up - add data about user to user document
exports.newUserSignUp = functions.auth.user().onCreate(user => {

    //add all data abou User to DB
    admin.firestore().collection(USERS).doc(user.uid).collection(USER_DATA).doc(USER_DATA).set({
        userUI: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhoneNumber: user.phoneNumber,
        userPhotoUrl: user.photoURL,
        // userMetaData: user.metadata,
        userProviderData: user.providerData,
        userProviderId: user.providerId,
        // userMultificator: user.multiFactor,
    })
})



// // function type: onCall, func sent e-mail, in data add json with: name email message
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




// // function type: onCall, create Ad in DB, in data add object with ad
exports.createAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) {
        throw new functions.https.HttpsError('aborted', 'Not logged!') // throw error - in front add .catch
    }

    // elements added in backend to object with ad :
    const userId = context.auth.uid // get user ID



    // TODO  to co niżej  - payment => isPromoted isApproved isApprovedReason
    const isPromoted = data.item.isPromoted // dane z fronta i trzeba ogarnąć płatności



    // auto approved
    const isApproved = true // always true when first add ad, can be change by admin only, in the future meaby will be false and wait for payment
    const isApprovedReason = "" // always empty when first add ad, write info if isApproved=false why rejected ad

    // how long is valid
    const adDate = AD_TIME_VALIDATION_1_DAY// how lond is valid, name in ms from 1970, type: NUMBER

    //final object with ad
    const adObject = { ...data.item, userId: userId, adDate: adDate, isPromoted: isPromoted, isApproved: isApproved, isApprovedReason: isApprovedReason }

    try {

        //save in current user folder
        await admin.firestore().collection(USERS).doc(userId).collection(ADS).doc(ADS).set({ [data.item.id]: data.item.id }, { merge: true })

        // save in main category
        await admin.firestore().collection(data.item.mainCategory).doc(data.item.id).set(adObject) // if ads: -1 then no limits

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})




// // function type: onCall, promote Ad in DB, in data add object with ad
exports.refreshAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) {
        throw new functions.https.HttpsError('aborted', 'Not logged!') // throw error - in front add .catch
    }


    // TODO  to co niżej  - payment => isPromoted isApproved isApprovedReason
    const isPromoted = data.item.isPromoted // dane z fronta i trzeba ogarnąć płatności

    // auto approved
    const isApproved = true // always true when first add ad, can be change by admin only, in the future meaby will be false and wait for payment
    const isApprovedReason = "" // always empty when first add ad, write info if isApproved=false why rejected ad

    // how long is valid
    const adDate = AD_TIME_VALIDATION_1_DAY // how lond is valid, name in ms from 1970, type: NUMBER


    try {

        // refresh ad and add new date now, change isPromoted na false
        await admin.firestore().collection(data.item.mainCategory).doc(data.item.id).update({ isPromoted: isPromoted, isApproved: isApproved, isApprovedReason: isApprovedReason, adDate: adDate })

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})