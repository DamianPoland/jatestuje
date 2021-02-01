import React, { useState, useEffect } from 'react'
import style from './User.module.css'


//components
import LoginRegisterFirebaseUI from './LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'
import { cars, fuel, years, gearbox, regions, cities, knowledge, choice } from '../../shared/data'

//photos
import Photo from '../../assets/photo.png'

//firebase
import { auth, storage } from '../../shared/fire'

// constans
import { IS_AUTH, USER_NAME, USER_EMAIL, WSZYSTKIE } from '../../shared/constans'


const helpArray = ['ogłoszenie 1', 'ogłoszenie 2', 'ogłoszenie 3',]

const User = props => {


    useEffect(() => {

        // scroll to top when component render
        window.scrollTo(0, 0)

    }, [])

    // ----------------------- START ADD ITEM --------------------------//

    // STATE - is Adding Item
    const [isAddingItem, setIsAddingItem] = useState(false)



    // STATE - set car id (name)
    const [carIdChosen, setCarIdChosen] = useState(WSZYSTKIE)

    // STATE - set car model
    const [carModelChosen, setCarModelChosen] = useState(WSZYSTKIE)

    // STATE - set fuel
    const [fualChosen, setFuelChosen] = useState(WSZYSTKIE)

    // STATE - set year from
    const [yearChosen, setYearChosen] = useState("")

    // STATE - set gearbox
    const [gearboxChosen, setGearboxChosen] = useState(WSZYSTKIE)



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
    const [regionChosen, setRegionChosen] = useState(WSZYSTKIE)

    // STATE - set city
    const [cityChosen, setCityChosen] = useState(WSZYSTKIE)

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
        setImage(image.map(() => null)) // clear image holder
        setImageURL(imageURL.map(() => null)) // clear image URL holder

        // delete images and folder from DB
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

        setIsAddingItem(false) // close item form
    }


    // set Regions on Change
    const setRegionChosenChandler = e => {
        setRegionChosen(e.target.value)
        setCityChosen(WSZYSTKIE) // reset city when region change
    }



    // set Car ID on Change
    const setCarIdChosenChandler = e => {
        setCarIdChosen(e.target.value)
        setCarModelChosen(WSZYSTKIE) // reset model when Car ID change
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
    }, [image[0]])

    // add image 1 to DB and show to user
    useEffect(() => {
        addImgToDB(image[1], 1)
    }, [image[1]])

    // add image 2 to DB and show to user
    useEffect(() => {
        addImgToDB(image[2], 2)
    }, [image[2]])

    // add image 3 to DB and show to user
    useEffect(() => {
        addImgToDB(image[3], 3)
    }, [image[3]])


    // add image to DB and show to user
    const addImgToDB = (image, index) => {
        // if image is empty then return
        if (!image) {
            return
        }

        // check image size, if more than 1MB then show alert and return
        if (image.size >= 1048576) {
            // setShowAlertSmall({ name: 'Plik jest za duży. Max. to 1 MB.', icon: 'info', borderColor: 'orange', animationTime: '3' })
            console.log("Plik jest za duży");
            return
        }

        // set progress bar visibile
        setShowProgress(prevState => {
            let helpArray = [...prevState]
            helpArray[index] = true
            return helpArray
        })




        // send photo to DB
        const uploadTask = storage.ref(`images/${isAddingItem}/${image.name}`).put(image)
        uploadTask.on('state_changed',
            snapshot => { setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)) },//progress bar
            err => { //show if error
                console.log('upload error: ', err)
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
                        setShowProgress(prevState => {
                            let helpArray = [...prevState]
                            helpArray[index] = false
                            return helpArray
                        }) // set progress bar invisibile
                    }) // write url in state
                    .catch(errStorage => {
                        console.log('storage errStorage', errStorage);
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

        console.log("addItemToDB");
    }

    // ----------------------- STOP ADD ITEM --------------------------//



    // log out button
    const handlerLogOut = () => {
        auth.signOut() // sign out
        props.history.replace('/home') // go to /home
    }



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



                        // all items
                        : <div>
                            <p className={style.user__title}>Witaj {localStorage.getItem(USER_NAME)}</p>
                            <p className={style.user__itemsDesc}>Twoje ogłoszenia:</p>



                            <div className={style.user__itemsContainer}>
                                {helpArray.map(item => {
                                    return (
                                        <p key={item} className={style.user__item}>{item}</p>
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
