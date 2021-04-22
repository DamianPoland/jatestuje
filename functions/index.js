const functions = require("firebase-functions");
const nodemailer = require('nodemailer')
require('dotenv').config()
const admin = require('firebase-admin');
admin.initializeApp()



// // contains
const USERS = "users"
const ADS = "ads"
//const USER_DATA = "user_data"



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
// exports.newUserSignUp = functions.auth.user().onCreate(user => {

//     //add all data abou User to DB
//     admin.firestore().collection(USERS).doc(user.uid).collection(USER_DATA).doc(USER_DATA).set({
//         userUI: user.uid,
//         userEmail: user.email,
//         userName: user.displayName,
//         userPhoneNumber: user.phoneNumber,
//         userPhotoUrl: user.photoURL,
//     })
// })


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

        // TODO  do payment => isPromoted changed for always false
        // TODO  do payment => timeValidationAdDayCount
        const isPromoted = false //data.item.adData.isPromoted // changed for always false



        // elements added in backend to object with ad :
        const userId = context.auth.uid // get user ID
        const isApproved = true // always true when first add ad, can be change by admin only, in the future meaby will be false and wait for payment
        const isApprovedReason = "" // always empty when first add ad, write info if isApproved=false why rejected ad
        const createDate = new Date().getTime()// when ad is added to DB, name in ms from 1970, type: NUMBER, only for sort from newset ads
        const timeValidationDate = new Date().getTime() + 86400000 * data.item.adData.timeValidationAdDayCount // how lond ad is valid, name in ms from 1970, type: NUMBER, 1day = 86400000

        //final object with ad
        const adObject = { ...data.item, userData: { ...data.item.userData, userId: userId }, adData: { ...data.item.adData, isPromoted: isPromoted, isApproved: isApproved, isApprovedReason: isApprovedReason, createDate: createDate, timeValidationDate: timeValidationDate, } }

        //save in current user folder
        await admin.firestore().collection(USERS).doc(userId).collection(ADS).doc(ADS).set({ [data.item.adData.id]: data.item.adData.id }, { merge: true })

        // save in main category
        await admin.firestore().collection(data.item.adData.mainCategory).doc(data.item.adData.id).set(adObject)

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})


// edit Ad in DB, in data add object with ad => OK
exports.editAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not logged!') } // throw error - in front add .catch

    try {

        // get edited document from DB
        const editDoc = await admin.firestore().collection(data.item.adData.id.split(" ")[0]).doc(data.item.adData.id).get() // dostęp do firestore 
        const editDocData = editDoc.data()

        //check if ad belong to user
        if (context.auth.uid !== editDocData.userData.userId) { throw new functions.https.HttpsError('aborted', `Not user Ad!`) } // throw error - in front add .catch

        // elements taken from ad before edit
        const isApproved = true //always true after edition (second option => editDocData.isApproved // only admin can change)
        const isApprovedReason = ""// always "" after edition (second option => editDocData.isApprovedReason // only admin can change)
        const createDate = editDocData.adData.createDate  // when ad is added to DB - only after refresh can change
        const isPromoted = editDocData.adData.isPromoted // only after payment can change
        const timeValidationAdDayCount = editDocData.adData.timeValidationAdDayCount // only after payment can change
        const timeValidationDate = editDocData.adData.timeValidationDate // only after payment can change

        //final object with ad
        const adObject = { ...data.item, userData: { ...data.item.userData, userId: editDocData.userData.userId }, adData: { ...editDocData.adData, isApproved: isApproved, isApprovedReason: isApprovedReason, createDate: createDate, isPromoted: isPromoted, timeValidationAdDayCount: timeValidationAdDayCount, timeValidationDate: timeValidationDate, } }

        // save in main category
        await admin.firestore().collection(editDocData.adData.mainCategory).doc(data.item.adData.id).update(adObject)

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})



// refresh Ad in DB, in data add object with ad => OK + TODO
exports.refreshAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not logged!') } // throw error - in front add .catch

    try {

        // TODO  do payment => isPromoted 
        // TODO  do payment => timeValidationAdDayCount


        // get edited document from DB
        const refreshDoc = await admin.firestore().collection(data.item.adData.id.split(" ")[0]).doc(data.item.adData.id).get() // dostęp do firestore 
        const refreshDocData = refreshDoc.data()

        //check if ad belong to user
        if (context.auth.uid !== refreshDocData.userData.userId) { throw new functions.https.HttpsError('aborted', 'Not user Ad!') } // throw error - in front add .catch

        // elements refreshed in ad:
        const createDate = new Date().getTime() // when ad is added to DB, name in ms from 1970, type: NUMBER, only for sort from newset ads
        const timeValidationDate = new Date().getTime() + 86400000 * data.item.adData.timeValidationAdDayCount// how lond ad is valid, name in ms from 1970, type: NUMBER, 1day = 86400000
        const isPromoted = data.item.adData.isPromoted // check isPromoted

        // refresh ad and add new date now, change isPromoted na false
        await admin.firestore().collection(data.item.adData.mainCategory).doc(data.item.adData.id).update({ adData: { ...refreshDocData.adData, isPromoted: isPromoted, timeValidationDate: timeValidationDate, createDate: createDate } })

        return `Success!` //response jest w return

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})


// delete Ad from DB, delete ONLY firestore data - images delete from RFONT!, in data add object with ad => OK
exports.deleteAd = functions.https.onCall(async (data, context) => {

    // check if user is logged
    if (!context.auth) { throw new functions.https.HttpsError('aborted', 'Not logged!') } // throw error - in front add .catch

    try {

        // get deleted document from DB
        const deletedDoc = await admin.firestore().collection(data.item.adData.id.split(" ")[0]).doc(data.item.adData.id).get() // dostęp do firestore 
        const deletedDocData = deletedDoc.data()

        //check if ad belong to user
        if (context.auth.uid !== deletedDocData.userData.userId) { throw new functions.https.HttpsError('aborted', 'Not user Ad!') } // throw error - in front add .catch

        // delete ad in main category
        await admin.firestore().collection(data.item.adData.mainCategory).doc(data.item.adData.id).delete()

        //delete ad in current user folder
        await admin.firestore().collection(USERS).doc(context.auth.uid).collection(ADS).doc(ADS).update({ [data.item.adData.id]: admin.firestore.FieldValue.delete() })

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
        await admin.firestore().collection(data.item.adData.id.split(" ")[0]).doc(data.item.adData.id).update({ adData: { ...data.item.adData, isApproved: isApproved, isApprovedReason: isApprovedReason } })

        //get user
        const user = await admin.auth().getUser(data.item.userData.userId)

        //sent email to user
        return await sendEmail(user.email, 'Wiadomość od jaTestuje.pl', `Drogi użytkowniku. \n\nZ przykrością informujemy, że Twoje ogłoszenie "${data.item.itemDescription.adTitle}" zostało usunięte. \nPowód: ${data.reason}. \n\nWejdź na  https://jaTestuje.pl/user i edytuj ogłoszenie. \n\nPrzepraszamy za utrudnienia. \n\nPozdrawiamy. \nZespół jaTestuje.pl`)

    } catch (err) { throw new functions.https.HttpsError('aborted', err) } // throw error - in front add .catch 
})


// check all ads and sent email if ad is older than today - only Admin acces, in data{collection: cars}  sendEmail(to, subject, text)
exports.adminCheckAdsDateValidation = functions.https.onCall(async (data, context) => {

    // check if user is admin
    if (!context.auth.token.admin) { throw new functions.https.HttpsError('aborted', 'Not Admin!') } // throw error - in front add .catch

    functions.logger.log("start function adminCheckAdsDateValidation")

    try {

        // get all ads from collection
        const allAds = await admin.firestore().collection(data.collection).get()

        let counterHowManyAdsWasReaded = 0
        let counterHowManyEmailsTryToSent = 0

        //read every ad
        allAds.forEach(doc => {

            counterHowManyAdsWasReaded += 1

            // get user Email
            const userEmail = doc.data().userData.userEmail

            // only ads older than today
            if (doc.data().adData.timeValidationDate <= (new Date().getTime())) {

                counterHowManyEmailsTryToSent += 1

                //sent email to user
                sendEmail(userEmail, 'Wiadomość od jaTestuje.pl', `Drogi użytkowniku. \n\nTwoje ogłoszenie "${doc.data().itemDescription.adTitle}" straciło ważność. \n\nProsimy Cię abyś wszedł na  https://jaTestuje.pl/user i przedłużył jego ważność. \n\nPozdrawiamy. \nZespół jaTestuje.pl`)
                    .then(resp => functions.logger.log("adminCheckAdsDateValidation, email SENT: ", resp, "userEmail: ", userEmail))
                    .catch(err => functions.logger.log("adminCheckAdsDateValidation, email ERROR: ", err, "userEmail: ", userEmail))
            }
        })

        return { counterHowManyAdsWasReaded: counterHowManyAdsWasReaded, counterHowManyEmailsTryToSent: counterHowManyEmailsTryToSent }

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

