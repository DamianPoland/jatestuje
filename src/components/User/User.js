import React, { useState, useEffect } from 'react'
import style from './User.module.css'

// image compression library
import imageCompression from 'browser-image-compression';


//components
import LoginRegisterFirebaseUI from './LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'
import { ReactComponent as Ad } from '../../assets/ad.svg'
import AlertSmall from "../../UI/AlertSmall/AlertSmall"

//data 
import { mainCategories, fuel, years, gearbox, carEquipment, mileage, regions, cities, knowledge } from '../../shared/data'

//photos
import Photo from '../../assets/photo.png'
import PhotoEmpty from '../../assets/photoEmpty.png'

//firebase
import firebase from "firebase/app"
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


// set equimpment array
let equipmentChosen = []


//days text converter
const dayTextConverter = (adDate) => {
    const dateDifference = Math.floor((adDate - new Date().getTime()) / 86400000)
    if (dateDifference > 1) { return ` ${dateDifference} dni.` }
    else if (dateDifference === 1) { return ` jeden dzień.` }
    else { return ` mniej niż jeden dzień.` }
}


const User = () => {


    // show or hide small alert
    const [isAlertSmallShow, setIsAlertSmallShow] = useState(false)




    // ----------------------- START USER VIEW  --------------------------//


    // STATE - set user ADS
    const [userAds, setUserAds] = useState([])

    // get user ads when start comopnent
    useEffect(() => {
        getUserAds()
    }, [])

    // get user ads
    const getUserAds = () => {

        // if user is not sign in then not get user ads
        if (!localStorage.getItem(UID)) { return }

        //clear ads list before load
        setUserAds([])

        // get document with user ads
        firestore.collection(USERS).doc(localStorage.getItem(UID)).collection(ADS).doc(ADS).get()
            .then(resp => {

                // if no data then stop
                if (Object.keys(resp.data()).length === 0) { return }

                // change object to array
                const dataArray = Object.values(resp.data())

                let helpArrayWithAds = []

                // get ads from collections
                dataArray.forEach(item => {

                    console.log("item: ", item)

                    //get collection name as main category
                    const collectionName = item.split(" ")[0]

                    // get ad with itemID from DB and save in State
                    firestore.collection(collectionName).doc(item).get()
                        .then(resp => {

                            // if response is not undefined
                            resp.data() && setUserAds(prevState => [...prevState, resp.data()])
                        })
                        .catch(err => console.log('get ad err', err))
                })

            })
            .catch(err => console.log("get document err: ", err))
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

    // STATE - set year from
    const [yearChosen, setYearChosen] = useState("")

    // STATE - input Title
    const [adTitle, setAdTitle] = useState('') // input value

    // STATE - input Image
    const [image, setImage] = useState([null, null, null, null]) // input image value
    const [imageURL, setImageURL] = useState([null, null, null, null]) // write URL from DB
    const [smallImageURL, setSmallImageURL] = useState("") // write URL from DB
    const [progress, setProgress] = useState(0) // progress bar
    const [showProgress, setShowProgress] = useState([false, false, false, false]) // set progress visibility

    // STATE - input Description
    const [inputDescription, setInputDescription] = useState('') // input value

    // STATE - set technical knowlage
    const [techKnowledge, setTechKnowledge] = useState("")

    // STATE - set price of meeting
    const [priceOfMeeting, setPriceOfMeeting] = useState("")

    // STATE - set day time to meeting
    const [timeOfDay, setTimeOfDay] = useState("")

    // STATE - set region
    const [regionChosen, setRegionChosen] = useState("")

    // STATE - set city
    const [cityChosen, setCityChosen] = useState("")

    // STATE - input Name
    const [inputName, setInputName] = useState('') // input value

    // STATE - input Email
    const [inputEmail, setInputEmail] = useState('') // input value

    // STATE - input Phone
    const [inputPhone, setInputPhone] = useState('') // input value

    // STATE - input time ad validation
    const [inputTimeValidation, setInputTimeValidation] = useState(30) // input value

    // STATE - input isPromoted
    const [isPromoted, setIsPromoted] = useState(false) // input value

    // STATE - input Agreenent
    const [inputAgreenent, setAgreenent] = useState(false) // input value


    // CAR DATA:

    // STATE - set car id (name)
    const [carIdChosen, setCarIdChosen] = useState("")

    // STATE - set car model
    const [carModelChosen, setCarModelChosen] = useState("")

    // STATE - set fuel
    const [fuelChosen, setFuelChosen] = useState("")

    // STATE - set gearbox
    const [gearboxChosen, setGearboxChosen] = useState("")

    // STATE - set mileage
    const [mileageChosen, setMileageChosen] = useState("")

    // STATE - set capacity
    const [capacityChosen, setCapacityChosen] = useState("")

    // STATE - set power
    const [powerChosen, setPowerChosen] = useState("")



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
        console.log("equipmentChosen: ", equipmentChosen);
        isChecked ? equipmentChosen.push(item) : equipmentChosen.splice(equipmentChosen.findIndex(i => i === item), 1)
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
        if (!image) {
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
                        console.log('storage errStorage', errStorage);
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

        //first part of id is DB name +  data + random string
        const idGenerator = mainCategory + ' ' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds() + ' ' + Math.random().toString(36).substr(2)
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

        //clear only item data form data
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
        setYearChosen("")
        setAdTitle("")
        setImage(image.map(() => null)) // clear image holder
        setImageURL(imageURL.map(() => null)) // clear image URL holder
        setSmallImageURL("") // clear small image URL holder
        setInputDescription("")
        setTechKnowledge("")
        setPriceOfMeeting("")
        setTimeOfDay("")
        setRegionChosen("")
        setCityChosen("")
        setInputName("")
        setInputEmail("")
        setInputPhone("")
        setInputTimeValidation(30)
        setIsPromoted(false)
        setAgreenent(false)

        // only car category
        setCarIdChosen("")
        setCarModelChosen("")
        setFuelChosen("")
        setGearboxChosen("")
        setMileageChosen("")
        setCapacityChosen("")
        setPowerChosen("")
        equipmentChosen = []

        // close item form
        setIsAddingItem(false)
    }

    // add all data to form eg. when editing or refresh ad => OK
    const setDataToForm = item => {

        // data for all ads
        setId(item.id)// unique ID is always the same as document Key in DB, 
        setMainCategory(item.mainCategory) // main category of ad

        // all ads from form
        setTypeChosen(item.typeChosen)
        setYearChosen(item.yearChosen)
        setAdTitle(item.adTitle)
        setImageURL(item.imageURL) // all images URL in array
        setSmallImageURL(item.smallImageURL) // small image to show only in list of ads
        setInputDescription(item.inputDescription)
        setTechKnowledge(item.techKnowledge)
        setPriceOfMeeting(item.priceOfMeeting)
        setTimeOfDay(item.timeOfDay)
        setRegionChosen(item.regionChosen)
        setCityChosen(item.cityChosen)
        setInputName(item.inputName)
        setInputEmail(item.inputEmail)
        setInputPhone(item.inputPhone)
        setInputTimeValidation(item.inputTimeValidation)
        setIsPromoted(false) // false - user need to chose
        setAgreenent(false) // false - user need to chose

        // only car category
        setCarIdChosen(item.carIdChosen)
        setCarModelChosen(item.carModelChosen)
        setFuelChosen(item.fuelChosen)
        setGearboxChosen(item.gearboxChosen)
        setMileageChosen(item.mileageChosen)
        setCapacityChosen(item.capacityChosen)
        setPowerChosen(item.powerChosen)
        equipmentChosen = item.equipmentChosen
    }


    // get data from form and validate
    const getDataFromForm = () => {


        // TODO: validations


        // object to save in DB => OK
        const formObject = {

            /*elements added in backend :
            userId
            isApproved
            isApprovedReason
            adDate
            */

            // data for all ads
            id: id, // unique ID is always the same as document Key in DB, first part of id is collection name, second is adding date, third is time ,fourth is random string
            mainCategory: mainCategory, // main category of ad
            userPhoto: auth.currentUser.photoURL, // user login photo from login social media

            // all ads from form
            typeChosen: typeChosen,
            yearChosen: yearChosen,
            adTitle: adTitle,
            imageURL: imageURL, // all images URL in array
            smallImageURL: smallImageURL, // small image to show only in list of ads 
            inputDescription: inputDescription,
            techKnowledge: techKnowledge,
            priceOfMeeting: priceOfMeeting,
            timeOfDay: timeOfDay,
            regionChosen: regionChosen,
            cityChosen: cityChosen,
            inputName: inputName,
            inputEmail: inputEmail,
            inputPhone: inputPhone,
            inputTimeValidation: inputTimeValidation,
            isPromoted: isPromoted, // user set promoted or not
            inputAgreenent: inputAgreenent,

            // only car category from form
            carIdChosen: carIdChosen,
            carModelChosen: carModelChosen,
            fuelChosen: fuelChosen,
            gearboxChosen: gearboxChosen,
            mileageChosen: mileageChosen,
            capacityChosen: capacityChosen,
            powerChosen: powerChosen,
            equipmentChosen: equipmentChosen,

        }
        console.log(formObject)
        return formObject
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
    const sendAddItemToDB = () => {

        // get data from form
        const formObject = getDataFromForm()

        // create obj in DB - call backend
        const createAd = functions.httpsCallable('createAd')
        createAd({ item: formObject })
            .then(resp => {

                // update view after refresh ad
                getUserAds()

                // clear all data from form
                clearAllDataFromFormAndClose()

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Ogłoszenie dodane.', animationTime: '2', borderColor: 'green' })
                console.log("DB response: ", resp.data)

            })
            .catch(err => {

                // show alert
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log(err)
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

        // get data from form
        const formObject = getDataFromForm()

        // create obj in DB - call backend
        const editAd = functions.httpsCallable('editAd')
        editAd({ item: formObject })
            .then(resp => {

                // update view after refresh ad
                getUserAds()

                // clear all data from form
                clearAllDataFromFormAndClose()

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Ogłoszenie zmienione.', animationTime: '2', borderColor: 'green' })
                console.log("DB response: ", resp.data)

            })
            .catch(err => {

                // show alert
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log(err)
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

        // get data from form
        const formObject = getDataFromForm()

        // refresh ad - call backend
        const refreshAd = functions.httpsCallable('refreshAd')
        refreshAd({ item: formObject })
            .then(resp => {

                // update view after refresh ad
                getUserAds()

                // clear all data from form
                clearAllDataFromFormAndClose()

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Przedłużono ważność ogłoszenia.', animationTime: '2', borderColor: 'green' })
                console.log("DB response refresh: ", resp.data)
            })
            .catch(err => {

                // show alert
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log(err)
            })
    }


    // delete one ad from DB
    const deleteItemFromDB = (e, item) => {

        // delete ad - call backend + frontend for photos
        const deleteAd = functions.httpsCallable('deleteAd')
        deleteAd({ item: item })
            .then(resp => {

                // delete one ad from DB STORAGE with images
                deleteImagesAndFolderFromDB(item.id)

                // update view after refresh ad
                getUserAds()

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Usunieto ogłoszenie.', animationTime: '2', borderColor: 'green' })
                console.log("DB response delete: ", resp.data)
            })
            .catch(err => {

                // show alert
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log(err)
            })
    }


    // ----------------------- STOP ADD ITEM --------------------------//





    return (

        localStorage.getItem(UID)

            // user Log In
            ? <section className={style.background}>

                {/* AlertSmall */}
                {isAlertSmallShow && <AlertSmall alertIcon={isAlertSmallShow.alertIcon} description={isAlertSmallShow.description} animationTime={isAlertSmallShow.animationTime} borderColor={isAlertSmallShow.borderColor} hide={() => setIsAlertSmallShow(false)} />}

                <div className={style.container}>

                    {!isAddingItem

                        // USER LIST ITEMS
                        ? <div className={style.user}>
                            <p className={style.user__title}>Witaj {auth.currentUser?.displayName}</p>
                            <p className={style.user__itemsDesc}>Twoje ogłoszenia:</p>
                            <div className={style.user__itemsContainer}>

                                {userAds.map(item => {
                                    return (
                                        <div key={item.id} className={style.user__item}>

                                            <figure className={style.user__itemFigure}>
                                                <img className={style.user__itemImg} src={item.smallImageURL || PhotoEmpty} alt="main ad" />
                                            </figure>

                                            <div className={style.user__itemDescContainer}>
                                                <div className={style.user__itemDescTop}>
                                                    <p className={style.user__itemText}>{item.adTitle}</p>
                                                </div>

                                                <div className={style.user__itemDescTop}>
                                                    <div className={style.user__itemDescTopLeft}>
                                                        <p className={style.user__itemText}>{mainCategories.find(i => i.nameDB === item.mainCategory).name}:</p>

                                                        {item.carIdChosen
                                                            ? <div className={style.flexRow}>
                                                                <p className={style.user__itemText}>{mainCategories[0].carBrands.find(i => i.id === item.carIdChosen).name}</p>
                                                                <p className={style.user__itemText}>{item.carModelChosen}</p>
                                                            </div>
                                                            : <p className={style.user__itemText}>{item.typeChosen}</p>
                                                        }

                                                    </div>
                                                    <div className={style.user__itemDescTopRight} >
                                                        <p className={style.user__itemText}>{item.priceOfMeeting} zł/h</p>
                                                    </div>
                                                </div>

                                                {item.isApproved
                                                    ? <p className={style.user__itemDescMiddleText} style={{ color: "green" }}>Zaakceptowane</p>
                                                    : <p className={style.user__itemDescMiddleText} style={{ color: "red" }}>{`Oczekiwanie na akceptację: ${item.isApprovedReason}`}</p>}

                                                {new Date().getTime() <= item.adDate
                                                    ? <p className={style.user__itemDescMiddleText} style={{ color: "green" }}>Ważność ogłoszenia: {dayTextConverter(item.adDate)} </p>

                                                    : <div className={style.user__itemDescBottom}>
                                                        <p className={style.user__itemDescMiddleText} style={{ color: "red" }}>Ogłoszenie nieważne</p>
                                                        <button className={style.user__itemButton} onClick={e => prepareRefreshItemFromDB(e, item)}>przedłuż ważność</button>
                                                    </div>}

                                                {item.isPromoted && <p className={style.user__itemDescMiddleText} style={{ color: "blue" }}>Promowane</p>}

                                                <div className={style.user__itemDescBottom}>
                                                    <a className={style.user__itemButton} href={`/home/${item.id}`}>zobacz</a>
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
                        </div>


                        // AD ITEM
                        : <div className={style.ad}>

                            {/* main category section */}
                            {isAddingItem === ADD_AD
                                && <div className={style.ad__section}>
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
                                </div>}

                            {/* car section */}
                            {(isAddingItem === ADD_AD || isAddingItem === EDIT_AD)
                                && <div className={style.ad__section}>
                                    <p className={style.ad__title}>Dane:</p>

                                    <div className={style.ad__container}>

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Marka:</p>
                                                <select className={style.ad__itemList} onChange={setCarIdChosenChandler} value={carIdChosen}>
                                                    {mainCategories[0].carBrands.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                                </select>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Model:</p>
                                                <select className={style.ad__itemList} onChange={e => setCarModelChosen(e.target.value)} value={carModelChosen}>
                                                    {mainCategories[0].carBrands.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
                                                </select>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Paliwo:</p>
                                                <select className={style.ad__itemList} onChange={e => setFuelChosen(e.target.value)} value={fuelChosen}>
                                                    {fuel.map(item => <option key={item} value={item}>{item}</option>)}
                                                </select>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Skrzynia biegów:</p>
                                                <select className={style.ad__itemList} onChange={e => setGearboxChosen(e.target.value)} value={gearboxChosen}>
                                                    {gearbox.map(item => <option key={item} value={item}>{item}</option>)}
                                                </select>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <p className={style.ad__itemDesc}>Przebieg (tyś km.):</p>
                                                <select className={style.ad__itemList} onChange={e => setMileageChosen(e.target.value)} value={mileageChosen}>
                                                    {mileage.map(item => <option key={item} value={item}>{item}</option>)}
                                                </select>
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <label className={style.ad__itemDesc}>Pojemność (cm3):</label>
                                                <input onChange={event => setCapacityChosen(event.target.value)} value={capacityChosen} className={style.ad__itemList} type='number' />
                                            </div>}

                                        {(mainCategory === mainCategories[0].nameDB)
                                            && <div className={style.ad__itemContainer}>
                                                <label className={style.ad__itemDesc}>Moc (KM):</label>
                                                <input onChange={event => setPowerChosen(event.target.value)} value={powerChosen} className={style.ad__itemList} type='number' />
                                            </div>}

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Typ:</p>
                                            <select className={style.ad__itemList} onChange={e => setTypeChosen(e.target.value)} value={typeChosen}>
                                                {mainCategories.find(i => mainCategory === i.nameDB).type.map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Rok produkcji:</p>
                                            <select className={style.ad__itemList} onChange={e => setYearChosen(e.target.value)} value={yearChosen}>
                                                {years.map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {(mainCategory === mainCategories[0].nameDB)
                                        && <div className={style.ad__container}>
                                            <fieldset className={style.ad__containerEquipment}>
                                                <legend className={style.ad__legendEquipment}>Wyposarzenie: </legend>

                                                {carEquipment.map(item => {
                                                    return (
                                                        <div key={item.id} className={style.ad_checkBoxContainerEquipment}>
                                                            <input name={item.id} onChange={event => equipmentOnChangeHandler((event.target.name), (event.target.checked ? true : false))} className={style.ad__inputCheckBoxEquipment} type='checkbox' />
                                                            <label className={style.ad__labelCheckBoxEquipment}>{item.name}</label>
                                                        </div>
                                                    )
                                                })}

                                            </fieldset>
                                        </div>
                                    }
                                </div>}

                            {/* photo and description section */}
                            {(isAddingItem === ADD_AD || isAddingItem === EDIT_AD)
                                && <div className={style.ad__section}>

                                    <p className={style.ad__title}>Opis:</p>
                                    <div className={style.ad__container}>

                                        <div className={`${style.ad__itemContainer} ${style.ad__itemContainerWide}`}>
                                            <label className={style.ad__itemDesc}>Tytuł ogłoszenia (10-50 znaków):</label>
                                            <input onChange={event => setAdTitle(event.target.value)} value={adTitle} className={style.ad__itemList} type='text' />
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
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>


                                        <div className={`${style.ad__itemContainer} ${style.ad__itemTextArea}`}>
                                            <label className={style.ad__itemDesc}>Opis (50-500 znaków):</label>
                                            <textarea onChange={event => setInputDescription(event.target.value)} value={inputDescription} className={style.ad__itemList} type='textarea' rows='8' placeholder="Opisz szerzej przedmiot, chcesz zaprezentować." />
                                        </div>

                                    </div>
                                </div>}


                            {/* meeting data section */}
                            {(isAddingItem === ADD_AD || isAddingItem === EDIT_AD)
                                && <div className={style.ad__section}>
                                    <p className={style.ad__title}>Informacje o spotkaniu:</p>
                                    <div className={style.ad__container}>

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Jak oceniasz swoją wiedzę techniczną.</p>
                                            <select className={style.ad__itemList} onChange={e => setTechKnowledge(e.target.value)} value={techKnowledge}>
                                                {knowledge.map(item => <option key={item} value={item}> {item} </option>)}
                                            </select>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Jaka jest cena za godzinne spotkanie?</label>
                                            <input onChange={event => setPriceOfMeeting(event.target.value)} value={priceOfMeeting} className={style.ad__itemList} type='number' placeholder="np. 150" />
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Opisz preferowaną pore spotkania:</label>
                                            <input onChange={event => setTimeOfDay(event.target.value)} value={timeOfDay} className={style.ad__itemList} type='text' placeholder="np. każda sobota i niedziela" />
                                        </div>

                                    </div>
                                </div>}


                            {/* contact data section */}
                            {(isAddingItem === ADD_AD || isAddingItem === EDIT_AD)
                                && <div className={style.ad__section}>
                                    <p className={style.ad__title}>Twoje dane kontaktowe:</p>
                                    <div className={style.ad__container}>

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Województwo:</p>
                                            <select className={style.ad__itemList} onChange={setRegionChosenChandler} value={regionChosen}>
                                                {regions.map(item => <option key={item} value={item}> {item} </option>)}
                                            </select>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Miasto:</p>
                                            <select className={style.ad__itemList} onChange={e => setCityChosen(e.target.value)} value={cityChosen}>
                                                {cities.filter(item => item.region === regionChosen).map(item => <option key={item.city} value={item.city}> {item.city} </option>)}
                                            </select>
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Imię:</label>
                                            <input onChange={event => setInputName(event.target.value)} value={inputName} className={style.ad__itemList} type='text' placeholder="np. Jan" />
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Adres e-mail (opcjonalnie):</label>
                                            <input onChange={event => setInputEmail(event.target.value)} value={inputEmail} className={style.ad__itemList} type='text' placeholder="np. jan@gmail.com" />
                                        </div>

                                        <div className={style.ad__itemContainer}>
                                            <label className={style.ad__itemDesc}>Numer telefonu (wymagane):</label>
                                            <input onChange={event => setInputPhone(event.target.value)} value={inputPhone} className={style.ad__itemList} type='phone' placeholder="np. 100-200-300" maxLength="11" />
                                        </div>
                                    </div>
                                </div>}

                            {/* contact data section */}
                            {(isAddingItem === ADD_AD || isAddingItem === REFRESH_AD)
                                && <div className={style.ad__section}>
                                    <p className={style.ad__title}>Ogłoszenie:</p>
                                    <div className={style.ad__container}>

                                        <div className={style.ad_checkBoxContainer}>
                                            <p className={style.ad__labelCheckBoxLeftPaddingNull}>Ważność ogłoszenia: </p>

                                            <input checked={1 === inputTimeValidation} name="timeValidation" value="1" onChange={event => setInputTimeValidation(1)} className={style.ad__inputCheckBox} type='radio' />
                                            <label className={style.ad__labelRadiokBox}>1 dzień</label>

                                            <input checked={14 === inputTimeValidation} name="timeValidation" value="14" onChange={event => setInputTimeValidation(14)} className={style.ad__inputCheckBox} type='radio' />
                                            <label className={style.ad__labelRadiokBox}>14 dni</label>

                                            <input checked={30 === inputTimeValidation} name="timeValidation" value="30" onChange={event => setInputTimeValidation(30)} className={style.ad__inputCheckBox} type='radio' />
                                            <label className={style.ad__labelRadiokBox}>30 dni</label>
                                        </div>

                                        <div className={style.ad_checkBoxContainer}>
                                            <input onChange={event => setIsPromoted(event.target.checked ? true : false)} className={style.ad__inputCheckBox} type='checkbox' />
                                            <label className={style.ad__labelCheckBox}><b>Kup promowanie ogłoszenia. Koszt 1zł.</b></label>
                                        </div>

                                        <div className={style.ad_checkBoxContainer}>
                                            <input onChange={event => setAgreenent(event.target.checked ? true : false)} className={style.ad__inputCheckBox} type='checkbox' />
                                            <label className={style.ad__labelCheckBox}>Zapoznałem się i akceptuję <a href="/privacy-policy">regulamin serwisu</a> oraz <a href="/privacy-policy">politykę prywatności</a>.</label>
                                        </div>

                                    </div>
                                </div>}


                            <div className={style.btnContainer}>
                                <button className={`${style.btn} ${style.btnMmargin}`} onClick={cancelForm}>Anuluj</button>
                                <button className={style.btn} onClick={handleReadyAd}>OK</button>
                            </div>
                        </div>

                    }


                </div>
            </section >

            // user log out
            : <LoginRegisterFirebaseUI />
    )
}

export default User
