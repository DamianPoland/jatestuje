import React, { useState, useEffect } from 'react'
import style from './User.module.css'


//components
import LoginRegisterFirebaseUI from './LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'
import { cars, fuel, yearFrom, yearTo, gearbox, regions, cities } from '../../shared/data'

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
    const [yearFromChosen, setYearFromChosen] = useState(WSZYSTKIE)

    // STATE - set year to
    const [yearToChosen, setYearToChosen] = useState(WSZYSTKIE)

    // STATE - set gearbox
    const [gearboxChosen, setGearboxChosen] = useState(WSZYSTKIE)



    // STATE - input Description
    const [inputDescription, setInputDescription] = useState('') // input value

    // STATE - input Image
    const [image, setImage] = useState(null) // input image value
    const [imageURL, setImageURL] = useState('') // write URL from DB
    const [progress, setProgress] = useState(0) // progress bar
    const [showProgress, setShowProgress] = useState(false) // set progress visibility




    // STATE - set region
    const [regionChosen, setRegionChosen] = useState(WSZYSTKIE)

    // STATE - set city
    const [cityChosen, setCityChosen] = useState(WSZYSTKIE)

    // STATE - input Name
    const [inputName, setInputName] = useState('') // input value

    // STATE - input Email
    const [inputEmail, setInputEmail] = useState('') // input value

    // STATE - input Email
    const [inputPhone, setInputPhone] = useState('') // input value

    // STATE - input Agreenent
    const [inputAgreenent, setAgreenent] = useState(false) // input value



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
    const getPhoto = e => {
        setImage(e.target.files[0]) // add photo to state
    }

    // add image to DB and show to user
    useEffect(() => {

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
        setShowProgress(true)

        // TODO image NAME in DB must be unike


        // send photo to DB
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on('state_changed',
            snapshot => { setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)) },//progress bar
            err => { //show if error
                console.log('upload error: ', err)
                setShowProgress(false) // set progress bar invisibile
            },
            () => {
                storage // get url
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL() // get url
                    .then(url => {
                        setImageURL(url)
                        setShowProgress(false) // set progress bar invisibile
                    }) // write url in state
                    .catch(errStorage => {
                        console.log('storage errStorage', errStorage);
                        setShowProgress(false) // set progress bar invisibile
                    })
            })

    }, [image])






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
                        <div>

                            <div className={style.add}>
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
                                        <p className={style.add__itemDesc}>Paliwo:</p>
                                        <select className={style.add__itemList} onChange={e => setFuelChosen(e.target.value)}>
                                            {fuel.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Rok produkcji:</p>
                                        <div className={style.add__itemContainerItems}>
                                            <select className={style.add__itemList} onChange={e => setYearFromChosen(e.target.value)}>
                                                {yearFrom.map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                            <select className={style.add__itemList} onChange={e => setYearToChosen(e.target.value)}>
                                                {yearTo.map(item => <option key={item} value={item}>{item}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <p className={style.add__itemDesc}>Skrzynia biegów:</p>
                                        <select className={style.add__itemList} onChange={e => setGearboxChosen(e.target.value)}>
                                            {gearbox.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                </div>
                            </div>



                            <div className={style.add}>
                                <p className={style.add__title}>Zdjęcia i opis:</p>
                                <div className={style.add__container}>

                                    <div className={style.add__itemContainer}>
                                        <input
                                            id='file'
                                            // className=""
                                            style={{ display: "none" }}
                                            type='file'
                                            onChange={getPhoto}
                                            accept='image/*' //image/* = .jpg, .jpeg, .bmp, .svg, .png
                                        />
                                        <label htmlFor='file' className={` ${style.btn}`}><img className={style.add__itemImage} src={imageURL || Photo} alt='podgląd zdjęcia.' /> </label>
                                        {showProgress &&
                                            <div className={style.add__progressContainer}>
                                                <progress className={style.add__progressBar} value={progress} max='100' />
                                            </div>}
                                    </div>





                                    <div className={`${style.add__itemContainer} ${style.add__itemTextArea}`}>
                                        <label className={style.add__itemDesc}>Opis:</label>
                                        <textarea onChange={event => setInputDescription(event.target.value)} value={inputDescription} className={style.add__itemList} type='textarea' rows='15' placeholder="Opisz między innymi jak długo masz pojazd, ile zrobiłeś nim kilometrów, czy znasz się na sprawach technicznych itp. " />
                                    </div>
                                </div>
                            </div>





                            <div className={style.add}>
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
                                        <input onChange={event => setInputName(event.target.value)} value={inputName} className={style.add__itemList} type='text' />
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <label className={style.add__itemDesc}>Adres e-mail:</label>
                                        <input onChange={event => setInputEmail(event.target.value)} value={inputEmail} className={style.add__itemList} type='text' />
                                    </div>

                                    <div className={style.add__itemContainer}>
                                        <label className={style.add__itemDesc}>Numer telefonu:</label>
                                        <input onChange={event => setInputPhone(event.target.value)} value={inputPhone} className={style.add__itemList} type='text' />
                                    </div>

                                    <div className={style.add_checkBoxContainer}>
                                        <input onChange={event => setAgreenent(event.target.checked ? true : false)} className={style.add__inputCheckBox} type='checkbox' />
                                        <label className={style.add__labelCheckBox}>Zapoznałem się i akceptuję <a href="/privacy-policy">regulamin serwisu</a> oraz <a href="/privacy-policy">politykę prywatności</a>.</label>
                                    </div>

                                </div>
                            </div>



                            <div className={style.btnContainer}>
                                <button className={`${style.btn} ${style.btnMmargin}`} onClick={() => setIsAddingItem(false)}>Anuluj</button>
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
                                <button className={style.btn} onClick={() => setIsAddingItem(true)}>Dodaj</button>
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
