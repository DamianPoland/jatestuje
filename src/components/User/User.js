import React, { useState, useEffect } from 'react'
import style from './User.module.css'

// image compression library
import imageCompression from 'browser-image-compression';


//components
import LoginRegisterFirebaseUI from './LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'
import { ReactComponent as Ad } from '../../assets/ad.svg'

//data 
import { mainCategories, fuel, years, gearbox, carEquipment, mileage, regions, cities, knowledge } from '../../shared/data'

//photos
import Photo from '../../assets/photo.png'
import PhotoEmpty from '../../assets/photoEmpty.png'

//firebase
import firebase from "firebase/app"
import { auth, firestore, storage } from '../../shared/fire'

// constans
import { IS_AUTH, USER_NAME, ADS, USERS, PAYMENTS, POINTS } from '../../shared/constans'



// delete all images and folder from DB
const deleteImagesAndFolderFromDB = (isAdingItem) => {
    const ref = storage.ref(`images/${localStorage.getItem(IS_AUTH)}/${isAdingItem}`)
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


const User = props => {


    // ----------------------- START ADD ITEM --------------------------//

    // STATE - is Adding Item
    const [isAddingItem, setIsAddingItem] = useState(false)

    // STATE - set mainCategory
    const [mainCategory, setMainCategory] = useState(mainCategories[0].nameDB)

    // STATE - set documentKey
    const [documentKey, setDocumentKey] = useState("")

    // STATE - set type
    const [typeChosen, setTypeChosen] = useState("")

    // STATE - set year from
    const [yearChosen, setYearChosen] = useState("")

    // STATE - input Title
    const [adTitle, setAdTitle] = useState('') // input value

    // STATE - input Image
    const [image, setImage] = useState([null, null, null, null]) // input image value
    const [imageURL, setImageURL] = useState([null, null, null, null]) // write URL from DB
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

    // STATE - input Agreenent
    const [inputAgreenent, setAgreenent] = useState(false) // input value


    // CATEGORY CAR ONLY

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


    // call when click new category
    const mainCategoryHandler = (nameDB) => {

        // delete photos from DB STORAGE with images
        deleteImagesAndFolderFromDB(documentKey)
        setImage(image.map(() => null)) // clear image holder
        setImageURL(imageURL.map(() => null)) // clear image URL holder

        //set new category
        setMainCategory(nameDB)

        //clear all form data
        setTypeChosen("")
        setCarIdChosen("")
        setCarModelChosen("")
        setFuelChosen("")
        setGearboxChosen("")
        setMileageChosen("")
        setCapacityChosen("")
        setPowerChosen("")
        equipmentChosen = []
    }



    // clear all data from form, clear photos from storage and close item form
    const cancelForm = () => {

        // delete photos from DB STORAGE with images
        deleteImagesAndFolderFromDB(documentKey)

        // clear all data from form and close item form
        clearAllDataFromFormAndClose()

    }

    // clear all data from form and close item form
    const clearAllDataFromFormAndClose = () => {

        //all categories
        setMainCategory(mainCategories[0].nameDB)
        // setDocumentKey("") - NOT clear that - can't be empty - auto generate when main category change
        setTypeChosen("")
        setYearChosen("")
        setAdTitle("")
        setImage(image.map(() => null)) // clear image holder
        setImageURL(imageURL.map(() => null)) // clear image URL holder
        setInputDescription("")
        setTechKnowledge("")
        setPriceOfMeeting("")
        setTimeOfDay("")
        setRegionChosen("")
        setCityChosen("")
        setInputName("")
        setInputEmail("")
        setInputPhone("")
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


    //unique name of documentKey in DB storage and firestore
    useEffect(() => {

        // check if is enought point
        if (adPoints === 0) { // -1 is no limit
            console.log("Brak środków. Najpierw doładuj konto")
            return
        }

        //first part of documentKey is DB name +  data + random string
        const documentKeyGenerator = mainCategory + ' ' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds() + ' ' + Math.random().toString(36).substr(2)

        setDocumentKey(documentKeyGenerator)

        console.log("documentKey: ", documentKeyGenerator);

    }, [mainCategory])

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

    // push or pull equipment item
    const equipmentOnChangeHandler = (item, isChecked) => {
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


    // add image to DB and show to user
    const addImgToDB = (image, index) => {
        // if image is empty then return
        if (!image) {
            return
        }

        // set progress bar visibile
        setShowProgress(prevState => {
            let helpArray = [...prevState]
            helpArray[index] = true
            return helpArray
        })

        // check image size, if more than 1MB then compress photo and try again
        if (image.size >= 1048576) {
            console.log("Plik jest za duży, rozmiar: ", image.size / 1000000, "MB");
            console.log("image before compress: ", image);

            // compression options
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }

            // start compression
            imageCompression(image, options)
                .then(compressedFile => {
                    console.log("after compression: ", compressedFile);
                    console.log("after compression size: ", compressedFile.size / 1000000, "MB");

                    // compression img save in state and run again function by state change => use effect
                    setImage(prevState => {
                        let helpArray = [...prevState]
                        helpArray[index] = compressedFile
                        return helpArray
                    })

                })
                .catch(error => {
                    console.log("compression error message: ", error.message)
                    setProgress(0)
                    setShowProgress(prevState => {
                        let helpArray = [...prevState]
                        helpArray[index] = false
                        return helpArray
                    }) // set progress bar invisibile
                })
            return
        }


        // send photo to DB
        const uploadTask = storage.ref(`images/${localStorage.getItem(IS_AUTH)}/${documentKey}/${image.name}`).put(image)
        uploadTask.on('state_changed',
            snapshot => { setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)) },//progress bar
            err => { //show if error
                console.log('upload error: ', err)
                setProgress(0)
                setShowProgress(prevState => {
                    let helpArray = [...prevState]
                    helpArray[index] = false
                    return helpArray
                }) // set progress bar invisibile
            },
            () => {
                storage // get url
                    .ref(`images/${localStorage.getItem(IS_AUTH)}/${documentKey}`)
                    .child(image.name)
                    .getDownloadURL() // get url
                    .then(url => {
                        setImageURL(prevState => {
                            let helpArray = [...prevState]
                            helpArray[index] = url
                            return helpArray
                        })
                        setProgress(0)
                        setShowProgress(prevState => {
                            let helpArray = [...prevState]
                            helpArray[index] = false
                            return helpArray
                        }) // set progress bar invisibile
                    }) // write url in state
                    .catch(errStorage => {
                        console.log('storage errStorage', errStorage);
                        setProgress(0)
                        setShowProgress(prevState => {
                            let helpArray = [...prevState]
                            helpArray[index] = false
                            return helpArray
                        }) // set progress bar invisibile
                    })
            })
    }

    // add item to DB
    const addItemToDB = () => {


        // TODO: validations


        // filter array imageURL and delete null elements
        const imageURLFultered = imageURL.filter(item => item != null)

        // object to save in DB
        const corObject = {

            // data for all ads
            id: `${new Date().getTime()} ${Math.random().toString(36).substr(2)}`, // unique ID only to item list because Each child in a list should have a unique "key"
            userId: localStorage.getItem(IS_AUTH), // user Id
            mainCategory: mainCategory, // main category of ad
            documentKey: documentKey, // is always the same as document Key in DB, first part of documentKey is collection name, second is adding date, third is time ,fourts is random
            adDate: new Date().getTime(), // date of add or refresh in DB - will be changed after by backend when user want to refresch ad, name in ms from 1970, type in firestore NUMBER
            userPhoto: auth.currentUser.photoURL, // user login photo from login social media
            isPromoted: false, // always false when first add ad, can by change by add promoting by backend
            isApproved: true, // always true when first add ad, can be change by admin only
            isApprovedReason: "", // always empty when first add ad, will be info why rejected

            // all ads from form
            typeChosen: typeChosen,
            yearChosen: yearChosen,
            adTitle: adTitle,
            imageURL: imageURLFultered,
            inputDescription: inputDescription,
            techKnowledge: techKnowledge,
            priceOfMeeting: priceOfMeeting,
            timeOfDay: timeOfDay,
            regionChosen: regionChosen,
            cityChosen: cityChosen,
            inputName: inputName,
            inputEmail: inputEmail,
            inputPhone: inputPhone,
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
        console.log(corObject);




        // TODO move to backend



        // save obj in DB
        firestore.collection(mainCategory).doc(documentKey).set(corObject) // save obj in firestore
            .then(() => console.log("corObject saved in firestore"))
            .then(() => firestore.collection(USERS).doc(localStorage.getItem(IS_AUTH)).collection(ADS).doc(ADS).set({ [documentKey]: documentKey }, { merge: true })) // save ad ID to current user folder in DB
            .then(() => console.log("adId saved in firestore"))
            .catch(err => console.log("error saving in firestore: ", err))


        // clear all data from form
        clearAllDataFromFormAndClose()
    }

    // ----------------------- STOP ADD ITEM --------------------------//




    // ----------------------- START USER VIEW  --------------------------//



    // STATE - set user ADS
    const [userAds, setUserAds] = useState([])

    // start/stop listener for user ads
    useEffect(() => {

        // if user is not sign in then not start listener
        if (!localStorage.getItem(IS_AUTH)) {
            return
        }

        // listener for collection
        const listener = firestore.collection(USERS).doc(localStorage.getItem(IS_AUTH)).collection(ADS).onSnapshot( //have two arguments which are functions
            resp => {

                //clear ads list before load
                setUserAds([])

                resp.forEach(doc => {

                    // if no data then stop
                    if (Object.keys(doc.data()).length === 0) {
                        return
                    }

                    // change object to array
                    const dataArray = Object.values(doc.data())


                    dataArray.forEach(item => {

                        //get collection name as main category
                        const collectionName = item.split(" ")[0]

                        // get ad with itemID from DB and save in State
                        firestore.collection(collectionName).doc(item).get()
                            .then(resp => {

                                // if response is not undefined
                                resp.data() && setUserAds(prevState => [...prevState, resp.data()])
                            })
                            .catch(err => console.log('listener err', err))
                    })


                })
            },
            err => console.log(err.message))

        return () => {
            listener() // clean up listener
        }
    }, [])


    // edit one ad in DB
    const editItemFromDB = (e, item) => {

        console.log("not ready editItemFromDB")

        // TODO move to backend

    }

    // delete one ad from DB
    const deleteItemFromDB = (e, item) => {

        // 1. delete one ad from DB STORAGE with images
        deleteImagesAndFolderFromDB(item.documentKey)

        // 2. delete one ad from DB FIRESTORE in specyfic folder
        firestore.collection(item.mainCategory).doc(item.documentKey).delete()
            .then(() => console.log(`deleted ad from ${item.mainCategory}`))

            // 3. delete one ad from DB FIRESTORE in users folder
            .then(() => firestore.collection(USERS).doc(localStorage.getItem(IS_AUTH)).collection(ADS).doc(ADS).update({ [item.documentKey]: firebase.firestore.FieldValue.delete() }))
            .then(() => console.log(`deleted ad from ${USERS}`))
            .catch(err => console.log(' delete err', err))
    }

    // promote one ad in DB
    const promoteItemFromDB = (e, item) => {

        console.log("not ready promoteItemFromDB")

        // TODO move to backend

    }

    // promote one ad in DB
    const refreshItemFromDB = (e, item) => {

        console.log("not ready refreshItemFromDB")

        // TODO move to backend

    }




    //get points from DB
    const [promotionPoints, setPromotionPoints] = useState("?")
    const [adPoints, setAdPoints] = useState("?")
    useEffect(() => {

        // if user is not sign in then return
        if (!localStorage.getItem(IS_AUTH)) {
            return
        }

        // get points from db and set in useState
        const getUserPointsInfo = firestore.collection(USERS).doc(localStorage.getItem(IS_AUTH)).collection(PAYMENTS).doc(POINTS).onSnapshot(i => {

            // if document is not created by backend yet then return
            if (i.data() === undefined) {
                return
            }

            // set points in useState
            setPromotionPoints(i.data().promotion)
            setAdPoints(i.data().ads) // if ads: -1 then no limits
        }, err => console.log('err onSnapshot:', err))

        return () => {
            getUserPointsInfo() // clean up listener
        }

    }, [])

    const buyPoints = type => {
        console.log("not ready: ", type)
    }


    // ----------------------- STOP USER VIEW  --------------------------//


    return (
        localStorage.getItem(IS_AUTH)

            // user Log In
            ? <section className={style.background}>
                <div className={style.container}>

                    {!isAddingItem

                        // USER LIST ITEMS
                        ? <div className={style.user}>
                            <p className={style.user__title}>Witaj {localStorage.getItem(USER_NAME)}</p>

                            <p className={style.user__accountDesc}>Twoje konto:</p>

                            <div className={style.user__accountContainer}>

                                <p className={style.user__accountDescSmall}>Twój adres e-mail: {auth.currentUser?.email}</p>

                                <div className={style.user__accountDescContainer}>
                                    <p className={style.user__accountDescSmall}>Promowanie ogłoszeń (ważne miesiąc): {promotionPoints} szt.</p>
                                    <div className={style.user__accountAdSVG} onClick={() => buyPoints("promotion points")}>
                                        <Ad />
                                    </div>
                                </div>

                                {adPoints !== -1
                                    ? <div className={style.user__accountDescContainer}>
                                        <p className={style.user__accountDescSmall}>Dodawanie ogłoszeń: (ważne miesiąc): {adPoints} szt.</p>
                                        <div className={style.user__accountAdSVG} onClick={() => buyPoints("ad points")}>
                                            <Ad />
                                        </div>
                                    </div>
                                    : <p className={style.user__accountDescSmall}>Dodawanie ogłoszeń: bez limitu</p>
                                }
                            </div>

                            <p className={style.user__itemsDesc}>Twoje ogłoszenia:</p>
                            <div className={style.user__itemsContainer}>

                                {userAds.map(item => {
                                    return (
                                        <div key={item.id} className={style.user__item}>

                                            <figure className={style.user__itemFigure}>
                                                <img className={style.user__itemImg} src={item.imageURL[0] || PhotoEmpty} alt="main ad" />
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
                                                    ? <p className={style.user__itemDescMiddleText} style={{ color: "green" }}>Zatwierdzone</p>
                                                    : <p className={style.user__itemDescMiddleText} style={{ color: "red" }}>{`Usunięte: ${item.isApprovedReason}`}</p>}

                                                <div className={style.user__itemDescBottom}>
                                                    <a className={style.user__itemButton} href={`/home/${item.documentKey}`}>zobacz</a>
                                                    <button className={style.user__itemButton} onClick={e => editItemFromDB(e, item)}>edytuj</button>
                                                    <button className={style.user__itemButton} onClick={e => deleteItemFromDB(e, item)}>usuń</button>
                                                    <button className={style.user__itemButton} onClick={e => promoteItemFromDB(e, item)}>promuj</button>
                                                    <button className={style.user__itemButton} onClick={e => refreshItemFromDB(e, item)}>odśwież</button>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })
                                }
                                <div className={style.user__itemAdSVG} onClick={() => setIsAddingItem(true)}>
                                    <Ad />
                                </div>
                            </div>
                        </div>


                        // AD ITEM
                        : <div className={style.ad}>

                            {/* main category section */}
                            <div className={style.ad__section}>
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
                            </div>

                            {/* car section */}
                            <div className={style.ad__section}>
                                <p className={style.ad__title}>Dane:</p>

                                <div className={style.ad__container}>

                                    {(mainCategory === mainCategories[0].nameDB)
                                        && <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Marka:</p>
                                            <select className={style.ad__itemList} onChange={setCarIdChosenChandler}>
                                                {mainCategories[0].carBrands.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                            </select>
                                        </div>}

                                    {(mainCategory === mainCategories[0].nameDB)
                                        && <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Model:</p>
                                            <select className={style.ad__itemList} onChange={e => setCarModelChosen(e.target.value)}>
                                                {mainCategories[0].carBrands.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                        </div>}

                                    {(mainCategory === mainCategories[0].nameDB)
                                        && <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Paliwo:</p>
                                            <select className={style.ad__itemList} onChange={e => setFuelChosen(e.target.value)}>
                                                {fuel.map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                        </div>}

                                    {(mainCategory === mainCategories[0].nameDB)
                                        && <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Skrzynia biegów:</p>
                                            <select className={style.ad__itemList} onChange={e => setGearboxChosen(e.target.value)}>
                                                {gearbox.map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                        </div>}

                                    {(mainCategory === mainCategories[0].nameDB)
                                        && <div className={style.ad__itemContainer}>
                                            <p className={style.ad__itemDesc}>Przebieg (tyś km.):</p>
                                            <select className={style.ad__itemList} onChange={e => setMileageChosen(e.target.value)}>
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
                                        <select className={style.ad__itemList} onChange={e => setTypeChosen(e.target.value)}>
                                            {mainCategories.find(i => mainCategory === i.nameDB).type.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Rok produkcji:</p>
                                        <select className={style.ad__itemList} onChange={e => setYearChosen(e.target.value)}>
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
                            </div>

                            {/* photo and description section */}
                            <div className={style.ad__section}>

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
                            </div>


                            {/* meeting data section */}
                            <div className={style.ad__section}>
                                <p className={style.ad__title}>Informacje o spotkaniu:</p>
                                <div className={style.ad__container}>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Jak oceniasz swoją wiedzę techniczną.</p>
                                        <select className={style.ad__itemList} onChange={e => setTechKnowledge(e.target.value)}>
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
                            </div>


                            {/* contact data section */}
                            <div className={style.ad__section}>
                                <p className={style.ad__title}>Twoje dane kontaktowe:</p>
                                <div className={style.ad__container}>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Województwo:</p>
                                        <select className={style.ad__itemList} onChange={setRegionChosenChandler}>
                                            {regions.map(item => <option key={item} value={item}> {item} </option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Miasto:</p>
                                        <select className={style.ad__itemList} onChange={e => setCityChosen(e.target.value)}>
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

                                    <div className={style.ad_checkBoxContainer}>
                                        <input onChange={event => setAgreenent(event.target.checked ? true : false)} className={style.ad__inputCheckBox} type='checkbox' />
                                        <label className={style.ad__labelCheckBox}>Zapoznałem się i akceptuję <a href="/privacy-policy">regulamin serwisu</a> oraz <a href="/privacy-policy">politykę prywatności</a>.</label>
                                    </div>

                                </div>
                            </div>


                            <div className={style.btnContainer}>
                                <button className={`${style.btn} ${style.btnMmargin}`} onClick={cancelForm}>Anuluj</button>
                                <button className={style.btn} onClick={addItemToDB}>Dodaj</button>
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
