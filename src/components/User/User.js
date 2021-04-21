import React, { useState, useEffect } from 'react'
import style from './User.module.css'
import { Link } from 'react-router-dom'


// image compression library
import imageCompression from 'browser-image-compression';

//components
import LoginRegisterFirebaseUI from './LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'
import { ReactComponent as Ad } from '../../assets/ad.svg'
import AlertSmall from "../../UI/AlertSmall/AlertSmall"
import Spinner from '../../UI/Spinner/Spinner'

//data 
import { mainCategories, fuel, yearsWithEmptyEl, gearbox, carEquipment, mileage, regions, cities, knowledge } from '../../shared/data'

//photos
import Photo from '../../assets/photo.png'
import PhotoEmpty from '../../assets/photoEmpty.png'

//firebase
import { auth, firestore, storage, functions } from '../../shared/fire'

// constans
import { UID, ADS, USERS, ADD_AD, EDIT_AD, REFRESH_AD } from '../../shared/constans'



// delete all images and folder from DB
const deleteImagesAndFolderFromDB = (isAdingItem) => {
    const ref = storage.ref(`images/${localStorage.getItem(UID)}/${isAdingItem}`)
    ref.listAll()
        .then(resp => {
            resp.items.forEach(fileRef => {
                storage.ref(fileRef.fullPath).getDownloadURL()
                    .then(url => {
                        storage.refFromURL(url).delete()
                            .then(() => console.log("deleted ad from storage"))
                            .catch(error => console.log("error deletion, error: ", error))
                    })
            })
        })
        .catch(error => console.log(error))
}


//days text converter
const dayTextConverter = (timeValidationDate) => {
    const dateDifference = Math.ceil((timeValidationDate - new Date().getTime()) / 86400000)
    if (dateDifference > 1) { return ` ${dateDifference} dni.` }
    else if (dateDifference === 1) { return ` 1 dzień.` }
    //else { return ` mniej niż jeden dzień.` }
}

// equipment array
let equipmentChosen = []


const User = ({ userAds, setUserAds }) => {


    // show or hide small alert
    const [isAlertSmallShow, setIsAlertSmallShow] = useState(false)

    // Spinner
    const [isMainSpinnerShow, setIsMainSpinnerShow] = useState(false)


    // ----------------------- START USER VIEW  --------------------------//


    // get user ads when start comopnent
    useEffect(() => {

        // start query if userAds is empty
        if (userAds.length === 0) {

            // get user ads and show main spinner
            getUserAds()
            setIsMainSpinnerShow(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // get user ads
    const getUserAds = () => {

        // if user is not sign in then not get user ads
        if (!localStorage.getItem(UID)) { return }

        // get document with user ads
        firestore.collection(USERS).doc(localStorage.getItem(UID)).collection(ADS).doc(ADS).get()
            .then(resp => {

                // if no data then stop
                if (!resp.data()) {
                    setIsMainSpinnerShow(false)
                    return
                }

                // change object to array
                const dataArray = Object.values(resp.data()).sort().reverse()

                // if empty data then stop
                if (dataArray.length === 0) {
                    setIsMainSpinnerShow(false)
                    return
                }

                // get ads from collections
                dataArray.forEach(item => {

                    //get collection name as main category
                    const collectionName = item.split(" ")[0]

                    // get ad with itemID from DB and save in State
                    firestore.collection(collectionName).doc(item).get()
                        .then(resp => {

                            // if response is not undefined
                            resp.data() && setUserAds(prevState => [...prevState, resp.data()])

                            //item.adData.mainCategory
                        })
                        .catch(err => {

                            // show alert Error
                            setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                            console.log('get ad err', err)

                            // hide main spinner
                            setIsMainSpinnerShow(false)
                        })
                        .finally(() => {

                            // when is last item then turn of spinner
                            if (item === dataArray[dataArray.length - 1]) {

                                // hide main spinner
                                setIsMainSpinnerShow(false)
                            }
                        })
                })
            })
            .catch(err => {

                // show alert Error
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log("get document err: ", err)

                // hide main spinner
                setIsMainSpinnerShow(false)
            })


    }

    // ----------------------- STOP USER VIEW  --------------------------//





    // ----------------------- START ADD ITEM --------------------------//


    // STATE - is Adding Item possibiliteies: false, ADD_AD, EDIT_AD, REFRESH_AD
    const [isAddingItem, setIsAddingItem] = useState(false)

    // STATE - set ad Id, generate before start form and when main category change
    const [id, setId] = useState("")

    // STATE - set mainCategory of ad, auto fill when category change
    const [mainCategory, setMainCategory] = useState(mainCategories[0].nameDB)

    // STATE - set type
    const [typeChosen, setTypeChosen] = useState("")
    const [typeChosenValidation, setTypeChosenValidation] = useState("")

    // STATE - set year from
    const [yearChosen, setYearChosen] = useState("")
    const [yearChosenValidation, setYearChosenValidation] = useState("")

    // STATE - input Title
    const [adTitle, setAdTitle] = useState('') // input value
    const [adTitleValidation, setAdTitleValidation] = useState(0) // input value

    // STATE - input Image
    const [image, setImage] = useState([null, null, null, null]) // input image value
    const [imageURL, setImageURL] = useState([null, null, null, null]) // write URL from DB
    const [smallImageURL, setSmallImageURL] = useState("") // write URL from DB
    const [progress, setProgress] = useState(0) // progress bar
    const [showProgress, setShowProgress] = useState([false, false, false, false]) // set progress visibility

    // STATE - input Description
    const [inputDescription, setInputDescription] = useState('') // input value
    const [inputDescriptionValidation, setInputDescriptionValidation] = useState(0) // input value

    // STATE - set technical knowlage
    const [techKnowledge, setTechKnowledge] = useState("")
    const [techKnowledgeValidation, setTechKnowledgeValidation] = useState("")

    // STATE - set price of meeting
    const [priceOfMeeting, setPriceOfMeeting] = useState("")
    const [priceOfMeetingValidation, setPriceOfMeetingValidation] = useState("")

    // STATE - set day time to meeting
    const [timeOfDay, setTimeOfDay] = useState("")
    const [timeOfDayValidation, setTimeOfDayValidation] = useState("")

    // STATE - set region
    const [regionChosen, setRegionChosen] = useState("")
    const [regionChosenValidation, setRegionChosenValidation] = useState("")

    // STATE - set city
    const [cityChosen, setCityChosen] = useState("")
    const [cityChosenValidation, setCityChosenValidation] = useState("")

    // STATE - input Name
    const [inputName, setInputName] = useState('')
    const [inputNameValidation, setInputNameValidation] = useState('')

    // STATE - input Email
    const [inputEmail, setInputEmail] = useState('')
    const [inputEmailValidation, setInputEmailValidation] = useState('')

    // STATE - input Phone
    const [inputPhone, setInputPhone] = useState('')

    // STATE - input time ad validation
    const [timeValidationAdDayCount, setTimeValidationAdDayCount] = useState(30)

    // STATE - input isPromoted
    const [isPromoted, setIsPromoted] = useState(false) // input value

    // STATE - input Agreenent
    const [inputAgreenent, setInputAgreenent] = useState(false) // input value
    const [inputAgreenentValidation, setAgreenentValidation] = useState(false) // input value


    // CAR DATA:

    // STATE - set car id (name)
    const [carIdChosen, setCarIdChosen] = useState("")
    const [carIdChosenValidation, setCarIdChosenValidation] = useState("")

    // STATE - set car model
    const [carModelChosen, setCarModelChosen] = useState("")
    const [carModelChosenValidation, setCarModelChosenValidation] = useState("")

    // STATE - set fuel
    const [fuelChosen, setFuelChosen] = useState("")
    const [fuelChosenValidation, setFuelChosenValidation] = useState("")

    // STATE - set gearbox
    const [gearboxChosen, setGearboxChosen] = useState("")
    const [gearboxChosenValidation, setGearboxChosenValidation] = useState("")

    // STATE - set mileage
    const [mileageChosen, setMileageChosen] = useState("")
    const [mileageChosenValidation, setMileageChosenValidation] = useState("")

    // STATE - set capacity
    const [capacityChosen, setCapacityChosen] = useState("")
    const [capacityChosenValidation, setCapacityChosenValidation] = useState("")

    // STATE - set power
    const [powerChosen, setPowerChosen] = useState("")
    const [powerChosenValidation, setPowerChosenValidation] = useState("")



    // scroll to top when start/stop form
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [isAddingItem])


    // set Regions on Change
    const setRegionChosenChandler = e => {
        setRegionChosen(e.target.value)
        setCityChosen("") // reset city when region change
    }

    // set Car ID on Change
    const setCarIdChosenChandler = e => {
        setCarIdChosen(e.target.value)
        setCarModelChosen("") // reset model when Car ID change
    }

    // push or pull equipment item, auto fire when some equipment is add/remove
    const equipmentOnChangeHandler = (item, isChecked) => {
        isChecked ? equipmentChosen.push(item) : equipmentChosen.splice(equipmentChosen.findIndex(i => i === item), 1)
        console.log("equipmentChosen: ", equipmentChosen);
    }

    // input title Handler
    const setAdTitleHandler = (value) => {
        setAdTitle(value)
        setAdTitleValidation(value.length)
    }

    // inpud description Handler
    const setInputDescriptionHandler = (value) => {
        setInputDescription(value)
        setInputDescriptionValidation(value.length)
    }

    // get photo from file/camera
    const getPhoto = (e, index) => {
        setImage(prevState => {
            let helpArray = [...prevState]
            helpArray[index] = e.target.files[0]
            return helpArray
        })
    }

    // add image 0 to DB and show to user
    useEffect(() => {
        addImgToDB(image[0], 0)
        addImgToDB(image[0], -1, 0.05, 160) //index -1 is for smallImageURL
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image[0]])

    // add image 1 to DB and show to user
    useEffect(() => {
        addImgToDB(image[1], 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image[1]])

    // add image 2 to DB and show to user
    useEffect(() => {
        addImgToDB(image[2], 2)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image[2]])

    // add image 3 to DB and show to user
    useEffect(() => {
        addImgToDB(image[3], 3)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image[3]])


    // add image to DB and show to user, index -1 is for smallImageURL
    const addImgToDB = async (image, index, maxSizeMB = 0.5, maxWidthOrHeight = "1280") => {

        // if image is empty then return
        if (!image) { return }

        // if file is not image then return
        if (image.type.split("/")[0] !== 'image') {
            setIsAlertSmallShow({ alertIcon: 'info', description: 'To nie jest zdjęcie.', animationTime: '2', borderColor: 'orange' })
            return
        }

        // set progress bar visibile if index !== -1 => index -1 is for smallImageURL
        if (index !== -1) {
            setShowProgress(prevState => {
                let helpArray = [...prevState]
                helpArray[index] = true
                return helpArray
            })
        }

        // check image size, if more than 0.5MB or for smallImageURL then compress photo
        if (image.size >= 1048576 / 2 || (index === -1)) {

            // compression options
            const options = {
                maxSizeMB: maxSizeMB, // in MB
                maxWidthOrHeight: maxWidthOrHeight, // in px
                useWebWorker: true
            }

            // start compression
            try {
                image = await imageCompression(image, options)

            } catch (error) {

                // set progress bar invisibile
                console.log("compression error message: ", error.message)
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Kompresja nie powiodła się. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                setProgress(0)
                setShowProgress(prevState => {
                    let helpArray = [...prevState]
                    helpArray[index] = false
                    return helpArray
                })

                // return to not save in DB
                return
            }
        }

        console.log("image.size: ", image.size / 1000 + " kB");

        // send photo to DB
        const uploadTask = storage.ref(`images/${localStorage.getItem(UID)}/${id}/${index}`).put(image)
        uploadTask.on('state_changed',
            snapshot => { setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)) },//progress bar
            err => { //show if error
                console.log('upload error: ', err)
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                setProgress(0)
                // set progress bar invisibile
                setShowProgress(prevState => {
                    let helpArray = [...prevState]
                    helpArray[index] = false
                    return helpArray
                })
            },
            () => {
                storage // get url
                    .ref(`images/${localStorage.getItem(UID)}/${id}`)
                    .child(`${index}`)
                    .getDownloadURL() // get url
                    .then(url => {

                        // write url in state, index - 1 is for smallImageURL
                        if (index !== -1) {
                            setImageURL(prevState => {
                                let helpArray = [...prevState]
                                helpArray[index] = url
                                return helpArray
                            })
                        } else {
                            setSmallImageURL(url)
                        }

                        setProgress(0)
                        // set progress bar invisibile
                        setShowProgress(prevState => {
                            let helpArray = [...prevState]
                            helpArray[index] = false
                            return helpArray
                        })
                    })

                    .catch(errStorage => {
                        console.log('storage errStorage', errStorage)
                        setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                        setProgress(0)
                        // set progress bar invisibile
                        setShowProgress(prevState => {
                            let helpArray = [...prevState]
                            helpArray[index] = false
                            return helpArray
                        })
                    })
            })
    }

    // generate new unique id of ad
    const idGenerator = (mainCategory) => {

        //generate id: DB name +  data(year-month-day) + data(from1970 in ms) + random string
        const idGenerator = `${mainCategory} ${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getTime()} ${Math.random().toString(36).substr(2)}`
        setId(idGenerator)
        console.log("id: ", idGenerator);
    }


    // call when click new category => OK
    const mainCategoryHandler = (nameDB) => {

        // delete photos from DB STORAGE
        deleteImagesAndFolderFromDB(id)
        setImage(image.map(() => null)) // clear image holder
        setImageURL(imageURL.map(() => null)) // clear image URL holder
        setSmallImageURL("") // clear small image URL holder

        // auto generate new unique key 
        idGenerator(nameDB)

        //set new category
        setMainCategory(nameDB)

        //clear only item data form
        setTypeChosen("")
        setCarIdChosen("")
        setCarModelChosen("")
        setFuelChosen("")
        setGearboxChosen("")
        setMileageChosen("")
        setCapacityChosen("")
        setPowerChosen("")
        setYearChosen("")
        equipmentChosen = []
    }

    // clear all data from form and close item form => OK
    const clearAllDataFromFormAndClose = () => {

        //all categories
        setId("")
        setMainCategory(mainCategories[0].nameDB)
        setTypeChosen("")
        setTypeChosenValidation("")
        setYearChosen("")
        setYearChosenValidation("")
        setAdTitle("")
        setAdTitleValidation(0)
        setImage(image.map(() => null)) // clear image holder
        setImageURL(imageURL.map(() => null)) // clear image URL holder
        setSmallImageURL("") // clear small image URL holder
        setInputDescription("")
        setInputDescriptionValidation(0)
        setTechKnowledge("")
        setTechKnowledgeValidation("")
        setPriceOfMeeting("")
        setPriceOfMeetingValidation("")
        setTimeOfDay("")
        setTimeOfDayValidation("")
        setRegionChosen("")
        setRegionChosenValidation("")
        setCityChosen("")
        setCityChosenValidation("")
        setInputName("")
        setInputNameValidation("")
        setInputEmail("")
        setInputEmailValidation("")
        setInputPhone("")
        setTimeValidationAdDayCount(30)
        setIsPromoted(false)
        setInputAgreenent(false)
        setAgreenentValidation(false)

        // only car category
        setCarIdChosen("")
        setCarIdChosenValidation("")
        setCarModelChosen("")
        setCarModelChosenValidation("")
        setFuelChosen("")
        setFuelChosenValidation("")
        setGearboxChosen("")
        setGearboxChosenValidation("")
        setMileageChosen("")
        setMileageChosenValidation("")
        setCapacityChosen("")
        setCapacityChosenValidation("")
        setPowerChosen("")
        setPowerChosenValidation("")
        equipmentChosen = []

        // close item form
        setIsAddingItem(false)
    }

    // add all data to form  => OK
    const setDataToForm = item => {

        // data for all ads
        setId(item.adData.id)// unique ID is always the same as document Key in DB, 
        setMainCategory(item.adData.mainCategory) // main category of ad

        // all ads from form
        setTypeChosen(item.itemData.typeChosen)
        setYearChosen(item.itemData.yearChosen)
        setAdTitle(item.itemDescription.adTitle)
        setAdTitleValidation(item.itemDescription.adTitle.length)
        setImageURL(item.itemDescription.imageURL) // all images URL in array
        setSmallImageURL(item.itemDescription.smallImageURL) // small image to show only in list of ads
        setInputDescription(item.itemDescription.inputDescription)
        setInputDescriptionValidation(item.itemDescription.inputDescription.length)
        setTechKnowledge(item.meetingDescription.techKnowledge)
        setPriceOfMeeting(item.meetingDescription.priceOfMeeting)
        setTimeOfDay(item.meetingDescription.timeOfDay)
        setRegionChosen(item.userData.regionChosen)
        setCityChosen(item.userData.cityChosen)
        setInputName(item.userData.inputName)
        setInputEmail(item.userData.inputEmail)
        setInputPhone(item.userData.inputPhone)
        setTimeValidationAdDayCount(item.adData.timeValidationAdDayCount)
        setIsPromoted(item.adData.isPromoted) // when edit mut be the same
        setInputAgreenent(item.adData.inputAgreenent) // when edit must be the same

        // only car category
        setCarIdChosen(item.itemData.carIdChosen)
        setCarModelChosen(item.itemData.carModelChosen)
        setFuelChosen(item.itemData.fuelChosen)
        setGearboxChosen(item.itemData.gearboxChosen)
        setMileageChosen(item.itemData.mileageChosen)
        setCapacityChosen(item.itemData.capacityChosen)
        setPowerChosen(item.itemData.powerChosen)
        equipmentChosen = item.itemData.equipmentChosen
    }


    // validate data from form, return true if valid and false if not
    const checkFormValidation = () => {

        let allValidations = true

        //constans
        const NIE_WYBRANO = "Nie wybrano"
        const NIE_WPROWADZONO = "Brak informacji"
        const NIEPOPRAWNA_WARTOSC = "Niepoprawna wartość"
        const NIEPOPRAWNE_IMIE = "Niepoprawne imię"
        const NIEPOPRAWNY_ADRES_EMAIL = "Niepoprawny adres e-mail"

        //only car
        if (mainCategory === mainCategories[0].nameDB) {

            if (!carIdChosen) {
                setCarIdChosenValidation(NIE_WYBRANO)
                allValidations = false
            } else { setCarIdChosenValidation("") }

            if (!carModelChosen) {
                setCarModelChosenValidation(NIE_WYBRANO)
                allValidations = false
            } else { setCarModelChosenValidation("") }

            if (!fuelChosen) {
                setFuelChosenValidation(NIE_WYBRANO)
                allValidations = false
            } else { setFuelChosenValidation("") }

            if (!gearboxChosen) {
                setGearboxChosenValidation(NIE_WYBRANO)
                allValidations = false
            } else { setGearboxChosenValidation("") }

            if (!mileageChosen) {
                setMileageChosenValidation(NIE_WYBRANO)
                allValidations = false
            } else { setMileageChosenValidation("") }

            if (!capacityChosen || capacityChosen.length > 4) {
                setCapacityChosenValidation(NIEPOPRAWNA_WARTOSC)
                allValidations = false
            } else { setCapacityChosenValidation("") }

            if (!powerChosen || powerChosen.length > 3) {
                setPowerChosenValidation(NIEPOPRAWNA_WARTOSC)
                allValidations = false
            } else { setPowerChosenValidation("") }
        }


        //rest all
        if (!typeChosen) {
            setTypeChosenValidation(NIE_WYBRANO)
            allValidations = false
        } else { setTypeChosenValidation("") }

        if (!yearChosen) {
            setYearChosenValidation(NIE_WYBRANO)
            allValidations = false
        } else { setYearChosenValidation("") }

        if (adTitle.length < 10 || adTitle.length > 50) {
            allValidations = false
        }

        if (inputDescription.length < 50 || inputDescription.length > 1000) {
            allValidations = false
        }

        if (!techKnowledge) {
            setTechKnowledgeValidation(NIE_WYBRANO)
            allValidations = false
        } else { setTechKnowledgeValidation("") }

        if (!priceOfMeeting || priceOfMeeting.length > 3) {
            setPriceOfMeetingValidation(NIEPOPRAWNA_WARTOSC)
            allValidations = false
        } else { setPriceOfMeetingValidation("") }

        if (!timeOfDay) {
            setTimeOfDayValidation(NIE_WPROWADZONO)
            allValidations = false
        } else { setTimeOfDayValidation("") }

        if (!regionChosen) {
            setRegionChosenValidation(NIE_WYBRANO)
            allValidations = false
        } else { setRegionChosenValidation("") }

        if (!cityChosen) {
            setCityChosenValidation(NIE_WYBRANO)
            allValidations = false
        } else { setCityChosenValidation("") }

        if (inputName.length < 3) {
            setInputNameValidation(NIEPOPRAWNE_IMIE)
            allValidations = false
        } else { setInputNameValidation("") }

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(inputEmail).toLowerCase())) {
            setInputEmailValidation(NIEPOPRAWNY_ADRES_EMAIL)
            allValidations = false
        } else { setInputEmailValidation("") }

        if (!inputAgreenent) {
            setAgreenentValidation(true)
            allValidations = false
        } else { setAgreenentValidation(false) }

        return allValidations
    }


    // get data from form
    const getDataFromForm = () => {

        // object to save in DB => OK
        const formObject = {

            /*elements added in backend :
            userData: {userId}
            adData: { isApproved, isApprovedReason, createDate, timeValidationDate (number days change from timeValidationAdDayCount)}
            */


            // data for all ads (all items are indexing off only group are on in Firebase )

            itemData: { // index excluded in cars collection

                // all ads from form
                typeChosen: typeChosen,
                yearChosen: yearChosen,

                // only car category from form
                carIdChosen: carIdChosen,
                carModelChosen: carModelChosen,
                fuelChosen: fuelChosen,
                gearboxChosen: gearboxChosen,
                mileageChosen: mileageChosen,
                capacityChosen: capacityChosen,
                powerChosen: powerChosen,
                equipmentChosen: equipmentChosen,
            },


            itemDescription: { // index excluded in cars collection
                adTitle: adTitle,
                imageURL: imageURL, // all images URL in array // index excluded
                smallImageURL: smallImageURL, // small image to show only in list of ads
                inputDescription: inputDescription,
            },

            meetingDescription: { // index excluded in cars collection
                techKnowledge: techKnowledge,
                priceOfMeeting: priceOfMeeting,
                timeOfDay: timeOfDay,
            },

            userData: { // index excluded in cars collection
                userPhoto: auth.currentUser.photoURL, // user login photo from login social media
                userEmail: auth.currentUser.email, // user login/registration email
                regionChosen: regionChosen,
                cityChosen: cityChosen,
                inputName: inputName,
                inputEmail: inputEmail,
                inputPhone: inputPhone,
            },

            adData: { // index excluded in cars collection
                id: id, // unique ID is always the same as document Key in DB, Contains => 1. collection name, 2. adding date, 3. time 1970 ,4. random string
                mainCategory: mainCategory, // main category of ad
                timeValidationAdDayCount: timeValidationAdDayCount,
                isPromoted: isPromoted, // user set promoted or not
                inputAgreenent: inputAgreenent,
            },


        }
        console.log(formObject)
        return formObject
    }


    // get FAKE data 
    const getFAKEDataFromForm = () => {
        const formObject = {

            itemData: {

                // all ads from form
                typeChosen: "Hatchback",
                yearChosen: "2020",

                // only car category from form
                carIdChosen: "bmw",
                carModelChosen: "Seria 3",
                fuelChosen: "Diesel", // index excluded in cars collection
                gearboxChosen: "Manualna", // index excluded in cars collection
                mileageChosen: "50-100", // index excluded in cars collection
                capacityChosen: "2700", // index excluded in cars collection
                powerChosen: "90", // index excluded in cars collection
                equipmentChosen: ["onBoardComputer"], // index excluded in cars collection
            },


            itemDescription: {
                adTitle: "OSOBOWE 50 znaków Lorem ipsum dolor sit aec adipis",  // index excluded in cars collection
                imageURL: ["https://firebasestorage.googleapis.com/v0/b/jatestuje-pl.appspot.com/o/images%2FO3vuzsnjybMrpWQEt5UhiO4uPek1%2Fcars%202021-2-26%201614369647630%20r75kfl9mj%2F0?alt=media&token=c59d35ff-458e-46d1-89b8-343707c6efe2"], // all images URL in array // index excluded
                smallImageURL: "https://firebasestorage.googleapis.com/v0/b/jatestuje-pl.appspot.com/o/images%2FO3vuzsnjybMrpWQEt5UhiO4uPek1%2Fcars%202021-2-26%201614369647630%20r75kfl9mj%2F-1?alt=media&token=bf31f084-c475-421d-817d-b0a9085ac4ed", // small image to show only in list of ads  // index excluded
                inputDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta deserunt eveniet sed officiis velit accusantium illo vitae in sunt reiciendis repellendus officia minima itaque, asperiores nobis voluptates odit quae impedit. Maiores unde quis inventore optio officia? Assumenda pariatur est, excepturi provident aliquam recusandae nisi incidunt et praesentium. Obcaecati, porro maxime.", // index excluded in cars collection
            },

            meetingDescription: {
                techKnowledge: "Dobra", // index excluded in cars collection
                priceOfMeeting: "150", // index excluded in cars collection
                timeOfDay: "zawsze", // index excluded in cars collection
            },

            userData: {
                userPhoto: "https://lh5.googleusercontent.com/-EzRg2MRmQ7U/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclO9YakK8o2F7vB4MTNVchsIiYDxg/s96-c/photo.jpg", // user login photo from login social media  // index excluded in cars collection
                userEmail: auth.currentUser.email, // user login/registration email
                regionChosen: "pomorskie",
                cityChosen: "Gdynia",
                inputName: "Jan", // index excluded in cars collection
                inputEmail: "jan@jan.com", // index excluded in cars collection
                inputPhone: "100-220-300", // index excluded in cars collection
            },

            adData: {
                id: `${mainCategory} ${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getTime()} ${Math.random().toString(36).substr(2)}`,
                mainCategory: 'cars', // main category of ad
                timeValidationAdDayCount: 30,
                isPromoted: false, // user set promoted or not
                inputAgreenent: true, // index excluded in cars collection
            },
        }
        console.log(formObject)

        sendAddItemToDB(formObject)
    }



    // call when cancel form
    const cancelForm = () => {

        // delete photos from DB STORAGE with images only when adding ad, if edit or refresh then not clear
        isAddingItem === ADD_AD && deleteImagesAndFolderFromDB(id)

        // clear all data from form and close item form
        clearAllDataFromFormAndClose()
    }


    // after finish form, use form for: add, edit or refresh ad
    const handleReadyAd = () => {

        switch (isAddingItem) {
            case ADD_AD:
                sendAddItemToDB()
                break;
            case EDIT_AD:
                sendEditItemToDB()
                break;
            case REFRESH_AD:
                sendRefreshItemToDB()
                break;
            default:
                break;
        }
    }

    // prepare form to add ad
    const prepareAddItemFromDB = (e, item) => {

        console.log("item add: ", item);

        // auto generate new key
        idGenerator(mainCategory)

        // show form
        setIsAddingItem(ADD_AD)
    }

    // send ad to DB
    const sendAddItemToDB = (formObject = getDataFromForm()) => {

        //check if data in form is valid
        if (!checkFormValidation()) { return }

        // get object with all data - usunąć parametr z funkcji i to włączyć
        //const formObject = getDataFromForm()

        //clear ads list before load
        setUserAds([])

        // show main spinner
        setIsMainSpinnerShow(true)

        // clear all data from form and close
        clearAllDataFromFormAndClose()

        console.log("item: ", formObject)

        // create obj in DB - call backend
        const createAd = functions.httpsCallable('createAd')
        createAd({ item: formObject })
            .then(resp => {

                // update view after refresh ad
                getUserAds()

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Ogłoszenie dodane.', animationTime: '2', borderColor: 'green' })
                console.log("DB response: ", resp.data)

            })
            .catch(err => {

                // show alert Error
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log(err)

                // hide main spinner
                setIsMainSpinnerShow(false)
            })
    }

    // prepare form to edit one
    const prepareEditItemFromDB = (e, item) => {

        console.log("item edit: ", item);

        //set ad data to form
        setDataToForm(item)

        // show form
        setIsAddingItem(EDIT_AD)
    }

    // send edited ad to DB
    const sendEditItemToDB = () => {

        //check if data in form is valid
        if (!checkFormValidation()) { return }

        //clear ads list before load
        setUserAds([])

        // show main spinner
        setIsMainSpinnerShow(true)

        // get data from form
        const formObject = getDataFromForm()

        // clear all data from form and close
        clearAllDataFromFormAndClose()

        // create obj in DB - call backend
        const editAd = functions.httpsCallable('editAd')
        editAd({ item: formObject })
            .then(resp => {

                // update view after refresh ad
                getUserAds()

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Ogłoszenie zmienione.', animationTime: '2', borderColor: 'green' })
                console.log("DB response: ", resp.data)

            })
            .catch(err => {

                // show alert Error
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log(err)

                // hide main spinner
                setIsMainSpinnerShow(false)
            })
    }

    // prepare form to refresh one ad
    const prepareRefreshItemFromDB = (e, item) => {

        console.log("item refresh: ", item);

        //set ad data to form
        setDataToForm(item)

        // show form
        setIsAddingItem(REFRESH_AD)
    }


    // send refreshed ad to DB
    const sendRefreshItemToDB = () => {

        //check if data in form is valid
        if (!checkFormValidation()) { return }

        //clear ads list before load
        setUserAds([])

        // show main spinner
        setIsMainSpinnerShow(true)

        // clear all data from form and close
        clearAllDataFromFormAndClose()

        // get data from form
        const formObject = getDataFromForm()

        // refresh ad - call backend
        const refreshAd = functions.httpsCallable('refreshAd')
        refreshAd({ item: formObject })
            .then(resp => {

                // update view after refresh ad
                getUserAds()

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Przedłużono ważność ogłoszenia.', animationTime: '2', borderColor: 'green' })
                console.log("DB response refresh: ", resp.data)
            })
            .catch(err => {

                // show alert Error
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log(err)

                // hide main spinner
                setIsMainSpinnerShow(false)
            })
    }


    // delete one ad from DB
    const deleteItemFromDB = (e, item) => {

        //clear ads list before load
        setUserAds([])

        // show main spinner
        setIsMainSpinnerShow(true)

        // delete ad - call backend + frontend for photos
        const deleteAd = functions.httpsCallable('deleteAd')
        deleteAd({ item: item })
            .then(resp => {

                // delete one ad from DB STORAGE with images
                deleteImagesAndFolderFromDB(item.adData.id)

                // update view after refresh ad
                getUserAds()

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Usunieto ogłoszenie.', animationTime: '2', borderColor: 'green' })
                console.log("DB response delete: ", resp.data)
            })
            .catch(err => {

                // show alert Error
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log(err)

                // hide main spinner
                setIsMainSpinnerShow(false)
            })
    }


    // ----------------------- STOP ADD ITEM --------------------------//





    return (

        localStorage.getItem(UID)

            // user Log In
            ? <main className={style.background}>

                {/* AlertSmall */}
                {isAlertSmallShow && <AlertSmall alertIcon={isAlertSmallShow.alertIcon} description={isAlertSmallShow.description} animationTime={isAlertSmallShow.animationTime} borderColor={isAlertSmallShow.borderColor} hide={() => setIsAlertSmallShow(false)} />}

                <div className={style.container}>

                    {!isAddingItem

                        // USER LIST ITEMS
                        ? <section className={style.user}>
                            <p className={style.user__title}>Witaj {auth.currentUser?.displayName}</p>
                            <h1 className={style.user__itemsDesc}>Twoje ogłoszenia:</h1>
                            <div className={style.user__itemsContainer}>

                                {isMainSpinnerShow && <Spinner />}

                                {userAds.map(item => {
                                    return (
                                        <div key={item.adData.id} className={style.user__item}>

                                            <figure className={style.user__itemFigure}>
                                                <img className={style.user__itemImg} src={item.itemDescription.smallImageURL || PhotoEmpty} alt="main ad" onError={(e) => { e.target.onerror = null; e.target.src = PhotoEmpty }} />
                                            </figure>

                                            <div className={style.user__itemDescContainer}>
                                                <div className={style.user__itemDescTop}>
                                                    <p className={style.user__itemText}>{item.itemDescription.adTitle}</p>
                                                </div>

                                                <div className={style.user__itemDescTop}>
                                                    <div className={style.user__itemDescTopLeft}>
                                                        <p className={style.user__itemText}>{mainCategories.find(i => i.nameDB === item.adData.mainCategory).name}:</p>

                                                        {item.carIdChosen
                                                            ? <div className={style.flexRow}>
                                                                <p className={style.user__itemText}>{mainCategories[0].brand.find(i => i.id === item.itemData.carIdChosen).name}</p>
                                                                <p className={style.user__itemText}>{item.itemData.carModelChosen}</p>
                                                            </div>
                                                            : <p className={style.user__itemText}>{item.itemData.typeChosen}</p>
                                                        }

                                                    </div>
                                                    <div className={style.user__itemDescTopRight} >
                                                        <p className={style.user__itemText}>{item.meetingDescription.priceOfMeeting} zł/h</p>
                                                    </div>
                                                </div>

                                                {item.adData.isApproved
                                                    ? <p className={style.user__itemDescMiddleText} style={{ color: "green" }}>Zaakceptowane</p>
                                                    : <p className={style.user__itemDescMiddleText} style={{ color: "red" }}>{`Brak akceptacji: ${item.adData.isApprovedReason}`}</p>}

                                                {new Date().getTime() <= item.adData.timeValidationDate
                                                    ? <p className={style.user__itemDescMiddleText} style={{ color: "green" }}>Ważność ogłoszenia: {dayTextConverter(item.adData.timeValidationDate)} </p>

                                                    : <div className={style.user__itemDescBottom}>
                                                        <p className={style.user__itemDescMiddleText} style={{ color: "red" }}>Ogłoszenie nieważne</p>
                                                        <button className={style.user__itemButton} onClick={e => prepareRefreshItemFromDB(e, item)}>przedłuż ważność</button>
                                                    </div>}

                                                {item.adData.isPromoted && <p className={style.user__itemDescMiddleText} style={{ color: "blue" }}>Promowane</p>}

                                                <div className={style.user__itemDescBottom}>
                                                    <Link className={style.user__itemButton} to={`/offer/${item.adData.id}`}>zobacz</Link>
                                                    <button className={style.user__itemButton} onClick={e => prepareEditItemFromDB(e, item)}>edytuj</button>
                                                    <button className={style.user__itemButton} onClick={e => deleteItemFromDB(e, item)}>usuń</button>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })
                                }
                                <div className={style.user__itemAdSVG} onClick={prepareAddItemFromDB}>
                                    <Ad />
                                </div>
                            </div>

                            {/* <button onClick={getFAKEDataFromForm}>Dodaj fejkowe ogłoszenie</button> */}

                        </section>


                        // AD ITEM
                        : <div className={style.ad}>

                            {/* main category section */}
                            {isAddingItem === ADD_AD
                                && <section className={style.ad__section}>
                                    <p className={style.ad__title}>Kategorie:</p>
                                    <div className={style.ad__container}>
                                        {mainCategories.map(item => {
                                            return (
                                                <div key={item.nameDB} className={`${style.add__categoriesItemContainer} ${(mainCategory === item.nameDB) && style.add__categoriesItemContainerActive}`} onClick={() => mainCategoryHandler(item.nameDB)}>
                                                    <figure className={style.add__categoriesItemFigure}>
                                                        <img className={style.add__categoriesItemImg} src={item.photo} alt="main" />
                                                    </figure>
                                                    <p className={style.add__categoriesItemDesc}>{item.name}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </section>}

                            {/* car section */}
                            {(isAddingItem === ADD_AD || isAddingItem === EDIT_AD)
                                && <section className={style.ad__section}>
                                    <p className={style.ad__title}>Dane:</p>

                                    <div className={style.ad__container}>

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Marka:</p>
                                                <select className={style.ad__itemList} onChange={setCarIdChosenChandler} value={carIdChosen}>
                                                    {mainCategories[0].brand.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                                </select>
                                                <p className={style.ad__itemDescValidation}>{carIdChosenValidation}</p>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Model:</p>
                                                <select disabled={!carIdChosen} className={style.ad__itemList} onChange={e => setCarModelChosen(e.target.value)} value={carModelChosen}>
                                                    {mainCategories[0].brand.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
                                                </select>
                                                <p className={style.ad__itemDescValidation}>{carModelChosenValidation}</p>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Paliwo:</p>
                                                <select className={style.ad__itemList} onChange={e => setFuelChosen(e.target.value)} value={fuelChosen}>
                                                    {fuel.map(item => <option key={item} value={item}>{item}</option>)}
                                                </select>
                                                <p className={style.ad__itemDescValidation}>{fuelChosenValidation}</p>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Skrzynia biegów:</p>
                                                <select className={style.ad__itemList} onChange={e => setGearboxChosen(e.target.value)} value={gearboxChosen}>
                                                    {gearbox.map(item => <option key={item} value={item}>{item}</option>)}
                                                </select>
                                                <p className={style.ad__itemDescValidation}>{gearboxChosenValidation}</p>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Przebieg (tyś km.):</p>
                                                <select className={style.ad__itemList} onChange={e => setMileageChosen(e.target.value)} value={mileageChosen}>
                                                    {mileage.map(item => <option key={item} value={item}>{item}</option>)}
                                                </select>
                                                <p className={style.ad__itemDescValidation}>{mileageChosenValidation}</p>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <label className={style.ad__itemDesc}>Pojemność (cm3):</label>
                                                <input onChange={event => setCapacityChosen(event.target.value)} value={capacityChosen} className={style.ad__itemList} type='number' />
                                                <p className={style.ad__itemDescValidation}>{capacityChosenValidation}</p>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <label className={style.ad__itemDesc}>Moc (KM):</label>
                                                <input onChange={event => setPowerChosen(event.target.value)} value={powerChosen} className={style.ad__itemList} type='number' />
                                                <p className={style.ad__itemDescValidation}>{powerChosenValidation}</p>
                                            </div>}

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Typ:</p>
                                            <select className={style.ad__itemList} onChange={e => setTypeChosen(e.target.value)} value={typeChosen}>
                                                {mainCategories.find(i => mainCategory === i.nameDB).type.map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                            <p className={style.ad__itemDescValidation}>{typeChosenValidation}</p>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Rok produkcji:</p>
                                            <select className={style.ad__itemList} onChange={e => setYearChosen(e.target.value)} value={yearChosen}>
                                                {yearsWithEmptyEl.map(item => <option key={item} value={item}>{item !== "0" ? item : "pozostałe"}</option>)}
                                            </select>
                                            <p className={style.ad__itemDescValidation}>{yearChosenValidation}</p>
                                        </div>
                                    </div>

                                    {(mainCategory === mainCategories[0].nameDB)
                                        && <div className={style.ad__container}>
                                            <fieldset className={style.ad__containerEquipment}>
                                                <legend className={style.ad__legendEquipment}>Wyposarzenie: </legend>

                                                {carEquipment.map(item => {
                                                    return (
                                                        <div key={item.id} className={style.ad_checkBoxContainerEquipment}>
                                                            <input defaultChecked={equipmentChosen.some(i => i === item.id)} name={item.id} onChange={event => equipmentOnChangeHandler((event.target.name), (event.target.checked ? true : false))} className={style.ad__inputCheckBoxEquipment} type='checkbox' />
                                                            <label className={style.ad__labelCheckBoxEquipment}>{item.name}</label>

                                                        </div>
                                                    )
                                                })}

                                            </fieldset>
                                        </div>
                                    }
                                </section>}

                            {/* photo and description section */}
                            {(isAddingItem === ADD_AD || isAddingItem === EDIT_AD)
                                && <section className={style.ad__section}>

                                    <p className={style.ad__title}>Opis:</p>
                                    <div className={style.ad__container}>

                                        <div className={`${style.ad__itemContainer} ${style.ad__itemContainerWide}`}>
                                            <label className={style.ad__itemDesc}>Tytuł ogłoszenia (10-50 znaków):</label>
                                            <input onChange={event => setAdTitleHandler(event.target.value)} value={adTitle} className={style.ad__itemList} type='text' maxLength="50" />
                                            <p className={style.ad__itemDescValidation} style={adTitleValidation >= 10 ? { color: "green" } : null}>{adTitleValidation}</p>
                                        </div>


                                        <div className={style.ad__containerPhotos}>
                                            <p className={style.ad__itemContainer}>Zdjęcia:</p>
                                            <div className={style.ad__containerPhotos}>


                                                {[...Array(4)].map((item, index) => {
                                                    return (
                                                        <div key={index} className={style.ad__itemContainer}>
                                                            <input
                                                                id={`file${index}`}
                                                                // className=""
                                                                style={{ display: "none" }}
                                                                type='file'
                                                                onChange={(e) => getPhoto(e, index)}
                                                                accept='image/*' //image/* = .jpg, .jpeg, .bmp, .svg, .png
                                                            />
                                                            <label htmlFor={`file${index}`} className={` ${style.btn} ${style.ad__itemLabel}`}><img className={style.ad__itemImage} src={imageURL[index] || Photo} alt='podgląd zdjęcia.' /> </label>
                                                            {showProgress[index] &&
                                                                <div className={style.ad__progressContainer}>
                                                                    <progress className={style.ad__progressBar} value={progress} max='100' />
                                                                </div>}
                                                            {(index === 0 && !imageURL[0]) && <p className={style.ad__itemFirstPhotDesc}>Zdjęcie główne</p>}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>


                                        <div className={`${style.ad__itemContainer} ${style.ad__itemTextArea}`}>
                                            <label className={style.ad__itemDesc}>Opis (50-1000 znaków):</label>
                                            <textarea onChange={event => setInputDescriptionHandler(event.target.value)} value={inputDescription} className={style.ad__itemList} type='textarea' rows='8' placeholder="Opisz szerzej przedmiot, chcesz zaprezentować." maxLength="1000" />
                                            <p className={style.ad__itemDescValidation} style={inputDescriptionValidation >= 50 ? { color: "green" } : null}>{inputDescriptionValidation}</p>
                                        </div>

                                    </div>
                                </section>}


                            {/* meeting data section */}
                            {(isAddingItem === ADD_AD || isAddingItem === EDIT_AD)
                                && <section className={style.ad__section}>
                                    <p className={style.ad__title}>Informacje o spotkaniu:</p>
                                    <div className={style.ad__container}>

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Jak oceniasz swoją wiedzę techniczną.</p>
                                            <select className={style.ad__itemList} onChange={e => setTechKnowledge(e.target.value)} value={techKnowledge}>
                                                {knowledge.map(item => <option key={item} value={item}> {item} </option>)}
                                            </select>
                                            <p className={style.ad__itemDescValidation}>{techKnowledgeValidation}</p>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Jaka jest cena za godzinne spotkanie?</label>
                                            <input onChange={event => setPriceOfMeeting(event.target.value)} value={priceOfMeeting} className={style.ad__itemList} type='number' placeholder="np. 150" />
                                            <p className={style.ad__itemDescValidation}>{priceOfMeetingValidation}</p>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Opisz preferowaną pore spotkania:</label>
                                            <input onChange={event => setTimeOfDay(event.target.value)} value={timeOfDay} className={style.ad__itemList} type='text' placeholder="np. każda sobota i niedziela" maxLength="100" />
                                            <p className={style.ad__itemDescValidation}>{timeOfDayValidation}</p>
                                        </div>

                                    </div>
                                </section>}


                            {/* contact data section */}
                            {(isAddingItem === ADD_AD || isAddingItem === EDIT_AD)
                                && <section className={style.ad__section}>
                                    <p className={style.ad__title}>Twoje dane kontaktowe:</p>
                                    <div className={style.ad__container}>

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Województwo:</p>
                                            <select className={style.ad__itemList} onChange={setRegionChosenChandler} value={regionChosen}>
                                                {regions.map(item => <option key={item} value={item}> {item} </option>)}
                                            </select>
                                            <p className={style.ad__itemDescValidation}>{regionChosenValidation}</p>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Miasto:</p>
                                            <select disabled={!regionChosen} className={style.ad__itemList} onChange={e => setCityChosen(e.target.value)} value={cityChosen}>
                                                {cities.filter(item => item.region === regionChosen).map(item => <option key={item.city} value={item.city}> {item.city} </option>)}
                                            </select>
                                            <p className={style.ad__itemDescValidation}>{cityChosenValidation}</p>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Imię:</label>
                                            <input onChange={event => setInputName(event.target.value)} value={inputName} className={style.ad__itemList} type='text' placeholder="np. Jan" maxLength="10" />
                                            <p className={style.ad__itemDescValidation}>{inputNameValidation}</p>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Adres e-mail (wymagane):</label>
                                            <input onChange={event => setInputEmail(event.target.value)} value={inputEmail} className={style.ad__itemList} type='text' placeholder="np. jan@gmail.com" maxLength="50" />
                                            <p className={style.ad__itemDescValidation}>{inputEmailValidation}</p>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Numer telefonu (opcjonalnie):</label>
                                            <input onChange={event => setInputPhone(event.target.value)} value={inputPhone} className={style.ad__itemList} type='phone' placeholder="np. 100-200-300" maxLength="11" />
                                        </div>
                                    </div>
                                </section>}

                            {/* contact data section */}
                            {(isAddingItem === ADD_AD || isAddingItem === REFRESH_AD)
                                && <section className={style.ad__section}>
                                    <p className={style.ad__title}>Ogłoszenie:</p>
                                    <div className={style.ad__container}>

                                        <div className={style.ad_checkBoxContainer}>
                                            <p className={style.ad__labelCheckBoxLeftPaddingNull}>Ważność ogłoszenia: </p>

                                            <input checked={1 === timeValidationAdDayCount} name="timeValidationAdDayCount" value="1" onChange={() => setTimeValidationAdDayCount(1)} className={style.ad__inputCheckBox} type='radio' />
                                            <label className={style.ad__labelRadiokBox}>1 dzień</label>

                                            <input checked={30 === timeValidationAdDayCount} name="timeValidationAdDayCount" value="30" onChange={() => setTimeValidationAdDayCount(30)} className={style.ad__inputCheckBox} type='radio' />
                                            <label className={style.ad__labelRadiokBox}>30 dni</label>

                                            <input checked={60 === timeValidationAdDayCount} name="timeValidationAdDayCount" value="60" onChange={() => setTimeValidationAdDayCount(60)} className={style.ad__inputCheckBox} type='radio' />
                                            <label className={style.ad__labelRadiokBox}>60 dni</label>
                                        </div>

                                        <div className={style.ad_checkBoxContainer}>
                                            <input onChange={event => setIsPromoted(event.target.checked ? true : false)} className={style.ad__inputCheckBox} type='checkbox' checked={isPromoted} />
                                            <label className={style.ad__labelCheckBox}><b>{`Kup promowanie ogłoszenia. Koszt ${timeValidationAdDayCount === 60 ? 2 : 1}zł.`}</b></label>
                                        </div>

                                        <div className={style.ad_checkBoxContainer}>
                                            <input onChange={event => setInputAgreenent(event.target.checked ? true : false)} className={`${style.ad__inputCheckBox} ${inputAgreenentValidation && style.ad__inputCheckBoxValidation}`} type='checkbox' checked={inputAgreenent} />
                                            <label className={style.ad__labelCheckBox}>Zapoznałem się i akceptuję <a href="/privacy-policy">regulamin serwisu</a> oraz <a href="/privacy-policy">politykę prywatności</a>.</label>
                                            <p className={style.ad__itemDescValidation}>{inputAgreenentValidation}</p>
                                        </div>

                                    </div>
                                </section>}


                            <div className={style.btnContainer}>
                                <button className={`${style.btn} ${style.btnMmargin}`} onClick={cancelForm}>Anuluj</button>
                                <button className={style.btn} onClick={handleReadyAd}>OK</button>
                            </div>
                        </div>

                    }


                </div>
            </main >

            // user log out
            : <LoginRegisterFirebaseUI />
    )
}

export default User
