import React, { useState, useEffect } from 'react'
import style from './User.module.css'

// image compression library
import imageCompression from 'browser-image-compression';


//components
import LoginRegisterFirebaseUI from './LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'
import { ReactComponent as Ad } from '../../assets/ad.svg'

//data 
import { cars, fuel, years, gearbox, mileage, type, regions, cities, knowledge, choice } from '../../shared/data'

//photos
import Photo from '../../assets/photo.png'
import PhotoEmpty from '../../assets/photoEmpty.png'

//firebase
import { firestore, storage } from '../../shared/fire'

// constans
import { IS_AUTH, USER_NAME, USER_EMAIL, USER_PHOTO, ADS, USERS, PAYMENTS, POINTS } from '../../shared/constans'



// delete images and folder from DB
const deleteImagesAndFolderFromDB = (isAdingItem) => {
    const ref = storage.ref(`images/${isAdingItem}`)
    ref.listAll()
        .then(resp => {
            resp.items.forEach(fileRef => {
                storage.ref(fileRef.fullPath).getDownloadURL()
                    .then(url => {
                        storage.refFromURL(url).delete()
                            .then(() => console.log("deleted succesfully from storage"))
                            .catch(error => console.log("error deletion, error: ", error))
                    })
            })
        })
        .catch(error => console.log(error))
}



const User = props => {

    useEffect(() => {

        // scroll to top when component render
        window.scrollTo(0, 0)

    }, [])




    // ----------------------- START ADD ITEM --------------------------//

    // STATE - is Adding Item
    const [isAddingItem, setIsAddingItem] = useState(false)


    // STATE - set car id (name)
    const [carIdChosen, setCarIdChosen] = useState("")

    // STATE - set car model
    const [carModelChosen, setCarModelChosen] = useState("")

    // STATE - set year from
    const [yearChosen, setYearChosen] = useState("")

    // STATE - set fuel
    const [fuelChosen, setFuelChosen] = useState("")

    // STATE - set gearbox
    const [gearboxChosen, setGearboxChosen] = useState("")

    // STATE - set mileage
    const [mileageChosen, setMileageChosen] = useState("")

    // STATE - set type
    const [typeChosen, setTypeChosen] = useState("")



    // STATE - input Image
    const [image, setImage] = useState([null, null, null, null]) // input image value
    const [imageURL, setImageURL] = useState([null, null, null, null]) // write URL from DB
    const [progress, setProgress] = useState(0) // progress bar
    const [showProgress, setShowProgress] = useState([false, false, false, false]) // set progress visibility

    // STATE - input Description
    const [inputDescription, setInputDescription] = useState('') // input value



    // STATE - set technical knowlage
    const [techKnowledge, setTechKnowledge] = useState("")

    // STATE - set is posible to client drive a car
    const [choiceDriver, setChoiceDriver] = useState("")

    // STATE - set price of meeting
    const [priceOfMeeting, setPriceOfMeeting] = useState("")

    // STATE - set region
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


    // show ad item form
    const showAdItemForm = () => {

        // check if is enought point
        if (adPoints === 0) { // -1 is no limit
            console.log("Brak środków. Najpierw doładuj konto")
            return
        }

        //unique name of documentKey in DB storage and firestore - data and random string
        const itemMainNameInDB = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds() + ' ' + Math.random().toString(36).substr(2)
        setIsAddingItem(itemMainNameInDB)
    }

    // hide ad item form and clear all
    const hideAdItemForm = () => {

        // clear image holder
        setImage(image.map(() => null))

        // clear image URL holder
        setImageURL(imageURL.map(() => null))

        // delete images and folder from DB
        deleteImagesAndFolderFromDB(isAddingItem)

        // close item form
        setIsAddingItem(false)
    }

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
        const uploadTask = storage.ref(`images/${isAddingItem}/${image.name}`).put(image)
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
                    .ref(`images/${isAddingItem}`)
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
        console.log(imageURLFultered);



        // object to save in DB
        const corObject = {
            id: `${new Date().getTime()} ${Math.random().toString(36).substr(2)}`, // unique ID to e.g. item list because Each child in a list should have a unique "key"
            documentKey: isAddingItem, // is always the same as document Key in DB
            adDate: new Date().getTime(), // data dodania lub odświerzenia ogłoszenia w ms od 1970, typ w firestore NUMBER
            userEmail: localStorage.getItem(USER_EMAIL),
            userPhoto: localStorage.getItem(USER_PHOTO),
            isPromoted: false, // promowanie wyłaczone zawsze przy odawaniu zdjęcia
            isApproved: true, // automatycznie ustawia ogłoszenie jako zatwierdzone do wyświetlenia
            carIdChosen: carIdChosen,
            carModelChosen: carModelChosen,
            yearChosen: yearChosen,
            fuelChosen: fuelChosen,
            gearboxChosen: gearboxChosen,
            mileageChosen: mileageChosen,
            typeChosen: typeChosen,
            imageURL: imageURLFultered,
            inputDescription: inputDescription,
            techKnowledge: techKnowledge,
            choiceDriver: choiceDriver,
            priceOfMeeting: priceOfMeeting,
            timeOfDay: timeOfDay,
            regionChosen: regionChosen,
            cityChosen: cityChosen,
            inputName: inputName,
            inputEmail: inputEmail,
            inputPhone: inputPhone,
            inputAgreenent: inputAgreenent
        }
        console.log(corObject);




        // TODO move to backend


        // save obj in DB
        firestore.collection(ADS).doc(isAddingItem).set(corObject) // save obj in firestore
            .then(() => console.log("corObject saved in firestore"))
            .then(() => firestore.collection(USERS).doc(localStorage.getItem(USER_EMAIL)).collection(ADS).doc(isAddingItem).set({ documentKey: isAddingItem })) // save ad ID to current user folder in DB
            .then(() => console.log("adId saved in firestore"))
            .catch(err => console.log("error saving in firestore: ", err))







        // close and clear ad edition
        setIsAddingItem(false)
        setCarIdChosen("")
        setCarModelChosen("")
        setYearChosen("")
        setFuelChosen("")
        setGearboxChosen("")
        setMileageChosen("")
        setTypeChosen("")
        setImage(image.map(() => null)) // clear image holder
        setImageURL(imageURL.map(() => null)) // clear image URL holder
        setInputDescription("")
        setTechKnowledge("")
        setChoiceDriver("")
        setPriceOfMeeting("")
        setTimeOfDay("")
        setRegionChosen("")
        setCityChosen("")
        setInputName("")
        setInputEmail("")
        setInputPhone("")
        setAgreenent("")
    }

    // ----------------------- STOP ADD ITEM --------------------------//




    // ----------------------- START USER VIEW  --------------------------//



    // STATE - set user ADS
    const [userAds, setUserAds] = useState([])

    // start/stop listener for user ads
    useEffect(() => {

        // if user is not sign in then not start listener
        if (!localStorage.getItem(USER_EMAIL)) {
            return
        }

        // listener for collection
        const listener = firestore.collection(USERS).doc(localStorage.getItem(USER_EMAIL)).collection(ADS).onSnapshot( //have two arguments which are functions
            resp => {

                //clear ads list before load
                setUserAds([])

                resp.forEach(doc => {

                    // get ad with itemID from DB and save in State
                    firestore.collection(ADS).doc(doc.data().documentKey).get()
                        .then(resp => {
                            // console.log(resp.data())
                            setUserAds(prevState => [...prevState, resp.data()])
                        })
                        .catch(err => console.log('listener err', err))
                })
            },
            err => console.log(err.message))

        return () => {
            listener() // clean up listener
        }
    }, [])

    // delete one ad from DB
    const deleteItemFromDB = (e, item) => {

        // delete one ad from DB STORAGE with images
        deleteImagesAndFolderFromDB(item.documentKey)

        firestore.collection(ADS).doc(item.documentKey).delete() // delete one ad from DB FIRESTORE in ads folder
            .then(() => console.log("deleted ad in ADS"))
            .then(() => firestore.collection(USERS).doc(localStorage.getItem(USER_EMAIL)).collection(ADS).doc(item.documentKey).delete())  // delete one ad from DB FIRESTORE in users folder
            .then(() => console.log("deleted ad in USERS "))
            .catch(err => console.log(' delete err', err))
    }


    //get points from DB
    const [promotionPoints, setPromotionPoints] = useState("?")
    const [adPoints, setAdPoints] = useState("?")
    useEffect(() => {

        // if user is not sign in then return
        if (!localStorage.getItem(USER_EMAIL)) {
            return
        }

        // get points from db and set in useState
        const getUserPointsInfo = firestore.collection(USERS).doc(localStorage.getItem(USER_EMAIL)).collection(PAYMENTS).doc(POINTS).onSnapshot(i => {

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
        console.log("not ready: ", type);
    }


    // ----------------------- STOP USER VIEW  --------------------------//


    return (
        JSON.parse(localStorage.getItem(IS_AUTH))

            // user Log In
            ? <section className={style.background}>
                <div className={style.container}>

                    {isAddingItem
                        ?

                        // AD ITEM
                        <div className={style.ad}>

                            {/* car section */}
                            <div className={style.ad__section}>
                                <p className={style.ad__title}>Dane pojazdu:</p>
                                <div className={style.ad__container}>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Marka:</p>
                                        <select className={style.ad__itemList} onChange={setCarIdChosenChandler}>
                                            {cars.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Model:</p>
                                        <select className={style.ad__itemList} onChange={e => setCarModelChosen(e.target.value)}>
                                            {cars.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>


                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Rok produkcji:</p>
                                        <select className={style.ad__itemList} onChange={e => setYearChosen(e.target.value)}>
                                            {years.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Paliwo:</p>
                                        <select className={style.ad__itemList} onChange={e => setFuelChosen(e.target.value)}>
                                            {fuel.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Skrzynia biegów:</p>
                                        <select className={style.ad__itemList} onChange={e => setGearboxChosen(e.target.value)}>
                                            {gearbox.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Przebieg (tyś km.):</p>
                                        <select className={style.ad__itemList} onChange={e => setMileageChosen(e.target.value)}>
                                            {mileage.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Typ:</p>
                                        <select className={style.ad__itemList} onChange={e => setTypeChosen(e.target.value)}>
                                            {type.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                </div>
                            </div>



                            {/* photo and description section */}
                            <div className={style.ad__section}>
                                <p className={style.ad__title}>Zdjęcia i opis:</p>
                                <div className={style.ad__container}>

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

                                    <div className={`${style.ad__itemContainer} ${style.ad__itemTextArea}`}>
                                        <label className={style.ad__itemDesc}>Opis (50-500 znaków):</label>
                                        <textarea onChange={event => setInputDescription(event.target.value)} value={inputDescription} className={style.ad__itemList} type='textarea' rows='8' placeholder="Opisz szerzej pojazd który, chcesz zaprezentować (np.: stan techniczny i wizualny, jak długo masz pojazd, ile przejchałes nim kilometrów, itp.)" />
                                    </div>
                                </div>
                            </div>


                            {/* meeting data section */}
                            <div className={style.ad__section}>
                                <p className={style.ad__title}>Informacje o spotkaniu:</p>
                                <div className={style.ad__container}>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Jak oceniasz swoją więdzę techniczną <br />na temat samochodu?</p>
                                        <select className={style.ad__itemList} onChange={e => setTechKnowledge(e.target.value)}>
                                            {knowledge.map(item => <option key={item} value={item}> {item} </option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <p className={style.ad__itemDesc}>Czy instnieje możliwość aby <br />oglądający sam poprowadził samochód?</p>
                                        <select className={style.ad__itemList} onChange={e => setChoiceDriver(e.target.value)}>
                                            {choice.map(item => <option key={item} value={item}> {item} </option>)}
                                        </select>
                                    </div>

                                    <div className={style.ad__itemContainer}>
                                        <label className={style.ad__itemDesc}>Jaka jest cena za godzinne spotkanie z <br />przejażdżką min. 10 km?</label>
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
                                <button className={`${style.btn} ${style.btnMmargin}`} onClick={hideAdItemForm}>Anuluj</button>
                                <button className={style.btn} onClick={addItemToDB}>Dodaj</button>
                            </div>
                        </div>



                        // USER LIST ITEMS
                        : <div className={style.user}>
                            <p className={style.user__title}>Witaj {localStorage.getItem(USER_NAME)}</p>

                            <p className={style.user__accountDesc}>Twoje konto:</p>

                            <div className={style.user__accountContainer}>

                                <p className={style.user__accountDescSmall}>Twój adres e-mail: {localStorage.getItem(USER_EMAIL)}</p>

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
                                                    <div className={style.user__itemDescTopLeft}>
                                                        <p className={style.user__itemText}>{cars.find(i => i.id === item.carIdChosen).name}</p>
                                                        <p className={style.user__itemText}>{item.carModelChosen}</p>

                                                    </div>
                                                    <div className={style.user__itemDescTopRight} >
                                                        <p className={style.user__itemText}>{item.priceOfMeeting} zł/h</p>
                                                    </div>
                                                </div>

                                                {item.isApproved === true
                                                    ? <p className={style.user__itemDescMiddleText} style={{ color: "green" }}>Zatwierdzone</p>
                                                    : <p className={style.user__itemDescMiddleText} style={{ color: "red" }}>{`Usunięte: ${item.isApproved}`}</p>}

                                                <div className={style.user__itemDescBottom}>
                                                    <button className={style.user__itemButton} onClick={() => props.history.push(`/home/${item.documentKey}`)}>zobacz</button>
                                                    <button className={style.user__itemButton} onClick={() => console.log("not ready")}>edytuj</button>
                                                    <button className={style.user__itemButton} onClick={e => deleteItemFromDB(e, item)}>usuń</button>
                                                    <button className={style.user__itemButton} onClick={() => console.log("not ready")}>promuj</button>

                                                </div>
                                            </div>

                                        </div>
                                    )
                                })
                                }
                                <div className={style.user__itemAdSVG} onClick={showAdItemForm}>
                                    <Ad />
                                </div>
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
