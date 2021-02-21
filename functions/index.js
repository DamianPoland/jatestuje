const functions = require("firebase-functions");
const nodemailer = require('nodemailer')
require('dotenv').config()
const admin = require('firebase-admin');
admin.initializeApp()



// // contains
const USERS = "users"
const ADS = "ads"
const USER_DATA = "user_data"



// function to send email => OK
const sendEmail = async (to, subject, text) => {

    try {

        let transporter = nodemailer.createTransport({
            host: 'ssl0.ovh.net',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        let mailOptions = {
            from: process.env.EMAIL,
            to: to, // email addres
            subject: subject, // email subject
            text: text // email message
        }

        await transporter.sendMail(mailOptions)

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
}



// start automatycally when new user sign up - add data about user to user document => OK
exports.newUserSignUp = functions.auth.user().onCreate(user => {

    //add all data abou User to DB
    admin.firestore().collection(USERS).doc(user.uid).collection(USER_DATA).doc(USER_DATA).set({
        userUI: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhoneNumber: user.phoneNumber,
        userPhotoUrl: user.photoURL,
    })
})



// sent e-mail, in data add json with: name email message => OK
exports.sendEmail = functions.https.onCall(async (data, context) => {

    try {
        //sent email to user
        return await sendEmail(process.env.TO, 'jaTestuje.pl contact form', `Wiadomość wysłana z jaTestuje.pl z contact form: \nImię: ${data.name} \nEmail: ${data.email} \nWiadomość: ${data.message}`)

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})


// create Ad in DB, in data add object with ad => OK + TODO
exports.createAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not logged!') } // throw error - in front add .catch

    try {

        // TODO  do payment => isPromoted 
        // TODO  do payment => inputTimeValidation


        const isPromoted = data.item.isPromoted // check isPromoted

        // elements added in backend to object with ad :
        const userId = context.auth.uid // get user ID
        const isApproved = true // always true when first add ad, can be change by admin only, in the future meaby will be false and wait for payment
        const isApprovedReason = "" // always empty when first add ad, write info if isApproved=false why rejected ad
        const adDate = new Date().getTime() + 86400000 * data.item.inputTimeValidation// how lond ad is valid, name in ms from 1970, type: NUMBER, 1day = 86400000

        //final object with ad
        const adObject = { ...data.item, isPromoted: isPromoted, userId: userId, isApproved: isApproved, isApprovedReason: isApprovedReason, adDate: adDate }

        //save in current user folder
        await admin.firestore().collection(USERS).doc(userId).collection(ADS).doc(ADS).set({ [data.item.id]: data.item.id }, { merge: true })

        // save in main category
        await admin.firestore().collection(data.item.mainCategory).doc(data.item.id).set(adObject)

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})


// edit Ad in DB, in data add object with ad => OK
exports.editAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not logged!') } // throw error - in front add .catch

    try {

        // get edited document from DB
        const editDoc = await admin.firestore().collection(data.item.id.split(" ")[0]).doc(data.item.id).get() // dostęp do firestore 
        const editDocData = editDoc.data()

        //check if ad belong to user
        if (context.auth.uid !== editDocData.userId) { throw new functions.https.HttpsError('aborted', 'Not user Ad!') } // throw error - in front add .catch

        // elements taken from ad before edit
        const isApproved = editDocData.isApproved // only admin can change
        const isApprovedReason = editDocData.isApprovedReason // only admin can change
        const adDate = editDocData.adDate  // how long is valid - only after payment can change
        const isPromoted = editDocData.isPromoted // only after payment can change

        //final object with ad
        const adObject = { ...data.item, isApproved: isApproved, isApprovedReason: isApprovedReason, adDate: adDate, isPromoted: isPromoted, }

        // save in main category
        await admin.firestore().collection(editDocData.mainCategory).doc(data.item.id).update(adObject)

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})



// refresh Ad in DB, in data add object with ad => OK + TODO
exports.refreshAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not logged!') } // throw error - in front add .catch

    try {

        // TODO  do payment => isPromoted 
        // TODO  do payment => inputTimeValidation


        // get edited document from DB
        const refreshDoc = await admin.firestore().collection(data.item.id.split(" ")[0]).doc(data.item.id).get() // dostęp do firestore 
        const refreshDocData = refreshDoc.data()

        //check if ad belong to user
        if (context.auth.uid !== refreshDocData.userId) { throw new functions.https.HttpsError('aborted', 'Not user Ad!') } // throw error - in front add .catch

        // elements refreshed in ad:
        const adDate = new Date().getTime() + 86400000 * data.item.inputTimeValidation// how lond ad is valid, name in ms from 1970, type: NUMBER, 1day = 86400000
        const isPromoted = data.item.isPromoted // check isPromoted

        // refresh ad and add new date now, change isPromoted na false
        await admin.firestore().collection(data.item.mainCategory).doc(data.item.id).update({ isPromoted: isPromoted, adDate: adDate })

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})


// delete Ad from DB, in data add object with ad => OK
exports.deleteAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not logged!') } // throw error - in front add .catch

    try {

        // get edited document from DB
        const deletedDoc = await admin.firestore().collection(data.item.id.split(" ")[0]).doc(data.item.id).get() // dostęp do firestore 
        const deletedDocData = deletedDoc.data()

        //check if ad belong to user
        if (context.auth.uid !== deletedDocData.userId) { throw new functions.https.HttpsError('aborted', 'Not user Ad!') } // throw error - in front add .catch

        //delete ad in current user folder
        await admin.firestore().collection(USERS).doc(context.auth.uid).collection(ADS).doc(ADS).update({ [data.item.id]: admin.firestore.FieldValue.delete() })

        // delete ad in main category
        await admin.firestore().collection(data.item.mainCategory).doc(data.item.id).delete()

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})



// admin delete Ad from DB - only isApproved and isApprovedReason => OK
exports.adminDeleteAd = functions.https.onCall(async (data, context) => {

    // check if user is admin
    if (!context.auth.token.admin) { throw new functions.https.HttpsError('aborted', 'Not Admin!') } // throw error - in front add .catch

    const isApproved = false // only admin can change
    const isApprovedReason = data.reason // only admin can change

    functions.logger.log("jaTestuje.pl__________")

    try {

        // update add - delete
        await admin.firestore().collection(data.item.id.split(" ")[0]).doc(data.item.id).update({ isApproved: isApproved, isApprovedReason: isApprovedReason })

        //get user
        const user = await admin.auth().getUser(data.item.userId)

        //sent email to user
        return await sendEmail(user.email, 'Wiadomość od jaTestuje.pl', `Drogi użytkowniku. \n\nZ przykrością informujemy, że Twoje ogłoszenie "${data.item.adTitle}" zostało usunięte. \nPowód: ${data.reason}. \n\nZaloguj się na  https://jaTestuje.pl/user i ponownie dodaj ogłoszenie. \nPrzepraszamy za utrudnienia. \n\nPozdrawiamy. \nZespół jaTestuje.pl`)

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})




// to add admin, use this function on front. Remember to log out and log in
// const addAdminRole = functions.httpsCallable('addAdminRole')
// addAdminRole({ email: 'damianwilczynskipl@gmail.com' })
//     .then(resp => console.log(resp))
//     .catch(err => console.log(err))

// add admin role => OK
exports.addAdminRole = functions.https.onCall(async (data, context) => {


    // check if user is admin
    if (!context.auth.token.admin) { throw new functions.https.HttpsError('aborted', 'Not Admin!') } // throw error - in front add .catch

    try {
        // email added on front
        const user = await admin.auth().getUserByEmail(data.email)
        await admin.auth().setCustomUserClaims(user.uid, { admin: true })

        return `Success!` //response jest w return
    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})

