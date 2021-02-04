import React, { useState, useEffect } from 'react'
import style from './User.module.css'

// image compression library
import imageCompression from 'browser-image-compression';


//components
import LoginRegisterFirebaseUI from './LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'
import { ReactComponent as Duplicate } from '../../assets/duplicate.svg'

//data 
import { cars, fuel, years, gearbox, regions, cities, knowledge, choice } from '../../shared/data'

//photos
import Photo from '../../assets/photo.png'
import PhotoEmpty from '../../assets/photoEmpty.png'

//firebase
import { auth, firestore, storage } from '../../shared/fire'

// constans
import { IS_AUTH, USER_NAME, USER_EMAIL, USER_PHOTO, ADDS, USERS } from '../../shared/constans'



// delete images and folder from DB
const deleteImagesAndFolderFromDB = (isAddingItem) => {
    const ref = storage.ref(`images/${isAddingItem}`)
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


    // show add item form
    const showAddItemForm = () => {

        //unique name of id in DB storage and firestore - data and random string
        const itemMainNameInDB = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds() + ' ' + Math.random().toString(36).substr(2)
        setIsAddingItem(itemMainNameInDB)
    }

    // hide add item form and clear all
    const hideAddItemForm = () => {

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
        const corObject = { id: isAddingItem, user: localStorage.getItem(USER_EMAIL), userPhoto: localStorage.getItem(USER_PHOTO), carIdChosen: carIdChosen, carModelChosen: carModelChosen, yearChosen: yearChosen, fuelChosen: fuelChosen, gearboxChosen: gearboxChosen, imageURL: imageURLFultered, inputDescription: inputDescription, techKnowledge: techKnowledge, choiceDriver: choiceDriver, priceOfMeeting: priceOfMeeting, timeOfDay: timeOfDay, regionChosen: regionChosen, cityChosen: cityChosen, inputName: inputName, inputEmail: inputEmail, inputPhone: inputPhone, inputAgreenent: inputAgreenent }
        console.log(corObject);

        // save obj in DB
        firestore.collection(ADDS).doc(isAddingItem).set(corObject) // save obj in firestore
            .then(() => console.log("corObject saved in firestore"))
            .then(() => firestore.collection(USERS).doc(localStorage.getItem(USER_EMAIL)).collection(ADDS).doc(isAddingItem).set({ itemID: isAddingItem })) // save add ID to current user folder in DB
            .then(() => console.log("addId saved in firestore"))
            .catch(err => console.log("error saving in firestore: ", err))

        // close and clear add edition
        setIsAddingItem(false)
        setCarIdChosen("")
        setCarModelChosen("")
        setYearChosen("")
        setFuelChosen("")
        setGearboxChosen("")
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



    // STATE - set user ADDS
    const [userAdds, setUserAdds] = useState([])

    // start/stop listener for user adds
    useEffect(() => {

        // if user is not sign in then not start listener
        if (!localStorage.getItem(USER_EMAIL)) {
            return
        }

        // listener for collection
        const listener = firestore.collection(USERS).doc(localStorage.getItem(USER_EMAIL)).collection(ADDS).onSnapshot( //have two arguments which are functions
            resp => {

                //clear adds list before load
                setUserAdds([])

                resp.forEach(doc => {

                    console.log();
                    // get add with itemID from DB and save in State
                    firestore.collection(ADDS).doc(doc.data().itemID).get()
                        .then(resp => {
                            // console.log(resp.data())
                            setUserAdds(prevState => [...prevState, resp.data()])
                        })
                        .catch(err => console.log('listener err', err))
                })
            },
            err => console.log(err.message))

        return () => {
            listener() // clean up listener
        }
    }, [])

    // delete one add from DB
    const deleteItemFromDB = (e, item) => {
        console.log(item.id)

        // delete one add from DB STORAGE with images
        deleteImagesAndFolderFromDB(item.id)

        firestore.collection(ADDS).doc(item.id).delete() // delete one add from DB FIRESTORE in adds folder
            .then(() => console.log("deleted add in ADDS"))
            .then(() => firestore.collection(USERS).doc(localStorage.getItem(USER_EMAIL)).collection(ADDS).doc(item.id).delete())  // delete one add from DB FIRESTORE in users folder
            .then(() => console.log("deleted add in USERS "))
            .catch(err => console.log(' delete err', err))
    }

    // log out button
    const handlerLogOut = () => {
        auth.signOut() // sign out
        props.history.replace('/home') // go to /home
    }


    // ----------------------- STOP USER VIEW  --------------------------//


    return (
        JSON.parse(localStorage.getItem(IS_AUTH))

            // user Log In
            ? <section className={style.background}>
                <div className={style.container}>

                    {isAddingItem
                        ?

                        // ADD ITEM
                        <div className={style.add}>

                            {/* car section */}
                            <div className={style.add__section}>
                                <p className={style.add__title}>Dane pojazdu:</p>
                                <div className={style.add__container}>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Marka:</p>
                                        <select className={style.add__itemList} onChange={setCarIdChosenChandler}>
                                            {cars.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Model:</p>
                                        <select className={style.add__itemList} onChange={e => setCarModelChosen(e.target.value)}>
                                            {cars.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>


                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Rok produkcji:</p>
                                        <select className={style.add__itemList} onChange={e => setYearChosen(e.target.value)}>
                                            {years.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Paliwo:</p>
                                        <select className={style.add__itemList} onChange={e => setFuelChosen(e.target.value)}>
                                            {fuel.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Skrzynia biegów:</p>
                                        <select className={style.add__itemList} onChange={e => setGearboxChosen(e.target.value)}>
                                            {gearbox.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                </div>
                            </div>



                            {/* photo and description section */}
                            <div className={style.add__section}>
                                <p className={style.add__title}>Zdjęcia i opis:</p>
                                <div className={style.add__container}>

                                    {[...Array(4)].map((item, index) => {
                                        return (
                                            <div key={index} className={style.add__itemContainer}>
                                                <input
                                                    id={`file${index}`}
                                                    // className=""
                                                    style={{ display: "none" }}
                                                    type='file'
                                                    onChange={(e) => getPhoto(e, index)}
                                                    accept='image/*' //image/* = .jpg, .jpeg, .bmp, .svg, .png
                                                />
                                                <label htmlFor={`file${index}`} className={` ${style.btn} ${style.add__itemLabel}`}><img className={style.add__itemImage} src={imageURL[index] || Photo} alt='podgląd zdjęcia.' /> </label>
                                                {showProgress[index] &&
                                                    <div className={style.add__progressContainer}>
                                                        <progress className={style.add__progressBar} value={progress} max='100' />
                                                    </div>}
                                            </div>
                                        )
                                    })}

                                    <div className={`${style.add__itemContainer} ${style.add__itemTextArea}`}>
                                        <label className={style.add__itemDesc}>Opis:</label>
                                        <textarea onChange={event => setInputDescription(event.target.value)} value={inputDescription} className={style.add__itemList} type='textarea' rows='8' placeholder="Krótko opisz jak długo masz pojazd, ile przejchałes nim kilometrów, itp." />
                                    </div>
                                </div>
                            </div>


                            {/* meeting data section */}
                            <div className={style.add__section}>
                                <p className={style.add__title}>Informacje o spotkaniu:</p>
                                <div className={style.add__container}>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Jak oceniasz swoją więdzę techniczną <br />na temat samochodu?</p>
                                        <select className={style.add__itemList} onChange={e => setTechKnowledge(e.target.value)}>
                                            {knowledge.map(item => <option key={item} value={item}> {item} </option>)}
                                        </select>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Czy instnieje możliwość aby <br />oglądający sam poprowadził samochód?</p>
                                        <select className={style.add__itemList} onChange={e => setChoiceDriver(e.target.value)}>
                                            {choice.map(item => <option key={item} value={item}> {item} </option>)}
                                        </select>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <label className={style.add__itemDesc}>Jak jest cena za godzinne spotkanie wliczając około 10 km <br />przejażdżkę w złotówkach? (sugerowanie 100 - 200)</label>
                                        <input onChange={event => setPriceOfMeeting(event.target.value)} value={priceOfMeeting} className={style.add__itemList} type='number' placeholder="np. 150" />
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <label className={style.add__itemDesc}>Opisz preferowaną pore spotkania:</label>
                                        <input onChange={event => setTimeOfDay(event.target.value)} value={timeOfDay} className={style.add__itemList} type='text' placeholder="np. każda sobota i niedziela" />
                                    </div>

                                </div>
                            </div>


                            {/* contact data section */}
                            <div className={style.add__section}>
                                <p className={style.add__title}>Twoje dane kontaktowe:</p>
                                <div className={style.add__container}>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Województwo:</p>
                                        <select className={style.add__itemList} onChange={setRegionChosenChandler}>
                                            {regions.map(item => <option key={item} value={item}> {item} </option>)}
                                        </select>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Miasto:</p>
                                        <select className={style.add__itemList} onChange={e => setCityChosen(e.target.value)}>
                                            {cities.filter(item => item.region === regionChosen).map(item => <option key={item.city} value={item.city}> {item.city} </option>)}
                                        </select>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <label className={style.add__itemDesc}>Imię:</label>
                                        <input onChange={event => setInputName(event.target.value)} value={inputName} className={style.add__itemList} type='text' placeholder="np. Jan" />
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <label className={style.add__itemDesc}>Adres e-mail:</label>
                                        <input onChange={event => setInputEmail(event.target.value)} value={inputEmail} className={style.add__itemList} type='text' placeholder="np. jan@gmail.com" />
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <label className={style.add__itemDesc}>Numer telefonu:</label>
                                        <input onChange={event => setInputPhone(event.target.value)} value={inputPhone} className={style.add__itemList} type='phone' placeholder="np. 100-200-300" maxLength="11" />
                                    </div>

                                    <div className={style.add_checkBoxContainer}>
                                        <input onChange={event => setAgreenent(event.target.checked ? true : false)} className={style.add__inputCheckBox} type='checkbox' />
                                        <label className={style.add__labelCheckBox}>Zapoznałem się i akceptuję <a href="/privacy-policy">regulamin serwisu</a> oraz <a href="/privacy-policy">politykę prywatności</a>.</label>
                                    </div>

                                </div>
                            </div>


                            <div className={style.btnContainer}>
                                <button className={`${style.btn} ${style.btnMmargin}`} onClick={hideAddItemForm}>Anuluj</button>
                                <button className={style.btn} onClick={addItemToDB}>Dodaj</button>
                            </div>
                        </div>



                        // USER LIST ITEMS
                        : <div className={style.user}>
                            <p className={style.user__title}>Witaj {localStorage.getItem(USER_NAME)}</p>
                            <p className={style.user__itemsDesc}>Twoje ogłoszenia:</p>



                            <div className={style.user__itemsContainer}>

                                {userAdds.length === 0

                                    ? <div className={style.user__itemEmpty}>
                                        <p className={style.user__itemEmptyText}>Brak</p>
                                        <div className={style.user__itemEmptySVG}>
                                            <Duplicate />
                                        </div>
                                    </div>

                                    : userAdds.map(item => {
                                        return (
                                            <div key={item.id} className={style.user__item}>

                                                <div className={style.user__itemContainer}>
                                                    <figure className={style.user__itemFigure}>
                                                        <img className={style.user__itemImg} src={item.imageURL[0] || PhotoEmpty} alt="main add" />
                                                    </figure>

                                                    <div className={style.user__itemDescContainer}>
                                                        <div className={style.user__itemDescTop}>
                                                            <p className={style.user__itemText}>{cars.find(i => i.id === item.carIdChosen).name}</p>
                                                            <p className={style.user__itemText}>{item.carModelChosen}</p>
                                                        </div>

                                                        <div className={style.user__itemDescBottom}>
                                                            <button className={style.user__itemButton} onClick={() => props.history.push(`/home/${item.id}`)}>zobacz</button>
                                                            <button className={style.user__itemButton} onClick={() => console.log("działą")}>edytuj</button>
                                                            <button className={style.user__itemButton} onClick={e => deleteItemFromDB(e, item)}>usuń</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={style.user__itemDescRight} >
                                                    <p className={style.user__itemText}>{item.priceOfMeeting} zł/h</p>
                                                </div>

                                            </div>
                                        )
                                    })
                                }
                                <button className={style.btn} onClick={showAddItemForm}>Dodaj</button>
                            </div>



                            <div className={style.btnContainer}>
                                <button className={style.btn} onClick={handlerLogOut}>Wyloguj z konta: {localStorage.getItem(USER_EMAIL)}</button>
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
