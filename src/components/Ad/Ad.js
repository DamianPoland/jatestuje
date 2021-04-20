import React, { useState, useEffect } from 'react'
import style from './Ad.module.css'
import { Link } from 'react-router-dom'


//firebase
import { auth, firestore, functions } from '../../shared/fire'


//photos images svg
import PhotoEmpty from '../../assets/photoEmpty.png'
import User from '../../assets/user.png'
import { ReactComponent as Check } from '../../assets/check.svg'
import { ReactComponent as Phone } from '../../assets/phone.svg'
import { ReactComponent as Email } from '../../assets/email.svg'
import { ReactComponent as Location } from '../../assets/location.svg'
import { ReactComponent as Cubes } from '../../assets/cubes.svg'

// data
import { mainCategories, carEquipment } from '../../shared/data'

//components
import AlertSmall from "../../UI/AlertSmall/AlertSmall"
import Spinner from '../../UI/Spinner/Spinner'




const Ad = props => {

    // scroll to top when componene render
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // show or hide small alert
    const [isAlertSmallShow, setIsAlertSmallShow] = useState(false)

    // Spinner
    const [isMainSpinnerShow, setIsMainSpinnerShow] = useState(false)

    // STATE - set one AD
    const [oneAd, setOneAd] = useState()

    // STATE - set main photo
    const [mainPhoto, setMainPhoto] = useState()

    useEffect(() => {

        // show main spinner
        setIsMainSpinnerShow(true)

        // get ad with itemID from DB and save in State
        firestore.collection(props.match.params.key.split(" ")[0]).doc(props.match.params.key).get()
            .then(resp => {
                setOneAd(resp.data())
                console.log("resp.data(): ", resp.data());

                // set first photo as mine
                setMainPhoto(resp.data().itemDescription.imageURL[0])
            })
            .catch(err => {
                console.log('listener err', err)
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
            })
            .finally(() => {

                // hide main spinner
                setIsMainSpinnerShow(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Admin section
    const [isAdmin, setIsAdmin] = useState(false)
    const [removeAdReason, setRemoveAdReason] = useState("")

    // get info if is admin, in props is loged info to auth.currentUser not undefined
    useEffect(() => {
        auth.currentUser?.getIdTokenResult()
            .then(token => setIsAdmin(token.claims.admin))
    }, [props])

    // delete ad
    const deleteAd = () => {

        // show main spinner
        setIsMainSpinnerShow(true)

        // call delete to backend
        const adminDeleteAd = functions.httpsCallable('adminDeleteAd')
        adminDeleteAd({ reason: removeAdReason, item: oneAd })
            .then(resp => {

                // show alert
                setIsAlertSmallShow({ alertIcon: 'OK', description: 'Usunieto ogłoszenie.', animationTime: '2', borderColor: 'green' })
            })
            .catch(err => {
                setIsAlertSmallShow({ alertIcon: 'error', description: `${err}`, animationTime: '5', borderColor: 'red' })
                console.log(err)
            })
            .finally(() => {
                // hide main spinner
                setIsMainSpinnerShow(false)
            })
    }

    // send Emails To All Out Of Date Ads
    const sendEmailsToAllOutOfDateAds = () => {

        const collection = "" //add collection from DB to send emails: cars agriculture build electronics motorcycles others trailers trucks

        if (!collection) {
            console.log("collection is empty - return");
            return
        }

        // call send Emails to backend, resp is {counterHowManyAdsWasReaded, counterHowManyEmailsTryToSent}, check logs in DB (error or success for sending every mail)!
        console.log("sendEmailsToAllOutOfDateAds start")
        const adminCheckAdsDateValidation = functions.httpsCallable('adminCheckAdsDateValidation')
        adminCheckAdsDateValidation({ collection: collection })
            .then(resp => console.log(resp))
            .catch(err => console.log(err))
    }


    return (
        <main className={style.background}>
            {isMainSpinnerShow && <Spinner />}

            {/* AlertSmall */}
            {isAlertSmallShow && <AlertSmall alertIcon={isAlertSmallShow.alertIcon} description={isAlertSmallShow.description} animationTime={isAlertSmallShow.animationTime} borderColor={isAlertSmallShow.borderColor} hide={() => setIsAlertSmallShow(false)} />}
            {oneAd &&
                <div className={style.container}>

                    {/* photos section */}
                    <section className={style.photos__section}>

                        <div className={style.btnContainer}>
                            <button className={style.btn} onClick={() => window.history.back()}>{"< Wróć"}</button>
                        </div>

                        <div className={style.photos__itemDescTopContainer}>
                            <h1 className={style.photos__itemTextTitle}>{oneAd.itemDescription.adTitle}</h1>
                        </div>

                        <div className={style.photos}>
                            <div className={style.photos__container}>

                                <figure className={style.photos__figureBig}>
                                    <img className={style.photos__imgBig} src={mainPhoto || PhotoEmpty} alt="main" />
                                </figure>

                                <div className={style.photos__containerSmall}>
                                    {oneAd.itemDescription.imageURL.map((item, id) => {
                                        return (
                                            item &&
                                            <figure className={`${style.photos__figureSmall} ${mainPhoto === item && style.photos__figureSmallBorder}`} key={id}>
                                                <img onClick={() => setMainPhoto(item)} className={style.photos__imgSmall} src={item || PhotoEmpty} alt={`main${id}`} />
                                            </figure>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className={style.photos__descRight}>
                                <p className={style.photos__itemTextPrice}>{oneAd.meetingDescription.priceOfMeeting} zł/h</p>
                                <div className={style.photos__itemDescRightContainerRegion}>
                                    <p className={style.photos__itemTextRegion}>woj. {oneAd.userData.regionChosen},</p>
                                    <p className={style.photos__itemTextRegion}>Miasto: {oneAd.userData.cityChosen}</p>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* DESC params section */}
                    <section className={style.desc}>
                        <p className={style.desc__title}>Dane:</p>
                        <div className={style.desc__container}>
                            {oneAd.itemData.carIdChosen && <p className={style.desc__text}>Marka: <b>{mainCategories[0].brand.find(i => i.id === oneAd.itemData.carIdChosen).name}</b></p>}
                            {oneAd.itemData.carModelChosen && <p className={style.desc__text}>Model: <b>{oneAd.itemData.carModelChosen}</b></p>}
                            {oneAd.itemData.yearChosen && <p className={style.desc__text}>Rok produkcji: <b>{oneAd.itemData.yearChosen !== "0" ? oneAd.itemData.yearChosen : "starsze niż 2014"}</b></p>}
                            {oneAd.itemData.fuelChosen && <p className={style.desc__text}>Paliwo: <b>{oneAd.itemData.fuelChosen}</b></p>}
                            {oneAd.itemData.gearboxChosen && <p className={style.desc__text}>Skrzynia biegów: <b>{oneAd.itemData.gearboxChosen}</b></p>}
                            {oneAd.itemData.mileageChosen && <p className={style.desc__text}>Przebieg: <b>{oneAd.itemData.mileageChosen} tyś. km.</b></p>}
                            {oneAd.itemData.typeChosen && <p className={style.desc__text}>Typ: <b>{oneAd.itemData.typeChosen}</b></p>}

                            {oneAd.itemData.equipmentChosen.length !== 0
                                && <div className={style.ad__container}>
                                    <fieldset className={style.ad__containerEquipment}>
                                        <legend className={style.ad__legendEquipment}>Wyposarzenie: </legend>

                                        {oneAd.itemData.equipmentChosen.map(item => {
                                            return (
                                                <div key={item} className={style.ad_itemContainerEquipment}>
                                                    <div className={style.ad_svgContainerEquipment}>
                                                        <Check />
                                                    </div>
                                                    <p className={style.ad__textCheckBoxEquipment}>{carEquipment.find(i => i.id === item).name}</p>
                                                </div>
                                            )
                                        })}

                                    </fieldset>

                                </div>
                            }
                        </div>
                    </section>


                    {/* DESC meet section */}
                    <section className={style.desc}>
                        <p className={style.desc__title}>Opis użytkownika:</p>
                        <div className={style.desc__container}>
                            <p className={style.desc__text}>{oneAd.itemDescription.inputDescription}</p>
                        </div>
                    </section>

                    {/* DESC meet section */}
                    <section className={style.desc}>
                        <p className={style.desc__title}>Spotkanie:</p>
                        <div className={style.desc__container}>
                            <p className={style.desc__text}>Jak użytkownik ocenia swoją więdzę techniczną?: <b>{oneAd.meetingDescription.techKnowledge}</b></p>
                            <p className={style.desc__text}>Zaproponowana przez użytkownika cena za godzinne spotkanie: <b>{oneAd.meetingDescription.priceOfMeeting} zł/h</b></p>
                            <p className={style.desc__text}>Preferowana przez użytkownika pora spotkania: <b>{oneAd.meetingDescription.timeOfDay}</b></p>
                        </div>
                    </section>

                    {/* DESC meet section */}
                    <section className={style.desc}>
                        <p className={style.desc__title}>Dane kontaktowe:</p>
                        <div className={style.desc__container}>
                            <div className={style.desc__containerUser}>
                                <figure className={style.desc__containerfigure}>
                                    <img className={style.desc__containerimg} src={oneAd.userData.userPhoto || User} onError={(e) => { e.target.onerror = null; e.target.src = User }} alt="main" />
                                </figure>
                                <p className={style.desc__textName}>{oneAd.userData.inputName}</p>
                            </div>

                            <a className={style.desc__containerContact} href={`http://maps.google.com/?q=${oneAd.userData.cityChosen}`} target='_blank' rel="noopener noreferrer" >
                                <div className={style.desc__svg}>
                                    <Location />
                                </div>
                                <p className={style.desc__textContact}>{oneAd.userData.cityChosen}&nbsp;</p>
                                <p className={style.desc__textContact}>(woj. {oneAd.userData.regionChosen})</p>
                            </a>

                            <a className={style.desc__containerContact} href={`mailto:${oneAd.userData.inputEmail}?subject=Ogłoszenie z portalu jaTestuje.pl`}>
                                <div className={style.desc__svg}>
                                    <Email />
                                </div>
                                <p className={style.desc__textContact}>e-mail: {oneAd.userData.inputEmail}</p>
                            </a>

                            {oneAd.userData.inputPhone && <a className={style.desc__containerContact} href={`tel:${oneAd.userData.inputPhone}`}>
                                <div className={style.desc__svg}>
                                    <Phone />
                                </div>
                                <p className={style.desc__textContact}>tel: {oneAd.userData.inputPhone}</p>
                            </a>}

                            <Link to={`/userads/${oneAd.userData.userId}`} className={style.desc__containerContact} >
                                <div className={style.desc__svg}>
                                    <Cubes />
                                </div>
                                <p className={style.desc__textContact}>Zobacz inne ogłoszenia uzytkownika</p>
                            </Link>
                        </div>
                    </section>

                    {/* ADMIN meet section */}
                    {isAdmin
                        && <section className={style.desc}>
                            <p className={style.desc__title}>Administracja:</p>
                            <div className={style.desc__container}>

                                <div className={style.admin__itemContainer}>

                                    <p className={style.admin__itemDesc}>ad id: {oneAd.adData.id}</p>
                                    <p className={style.admin__itemDesc}>user id: {oneAd.userData.userId}</p>
                                    <p className={style.admin__itemDesc}>user REGISTER email: {oneAd.userData.userEmail}</p>
                                    <p className={style.admin__itemDesc}>user INPUT email: {oneAd.userData.inputEmail}</p>

                                    <label className={style.admin__itemDesc}>Podaj powód usunięcia ogłoszenia:</label>
                                    <input onChange={event => setRemoveAdReason(event.target.value)} value={removeAdReason} className={style.admin__itemList} type='text' />
                                    <button className={style.admin__itemButton} onClick={deleteAd}>usuń</button>
                                    <button className={style.admin__itemButtonEmail} onClick={sendEmailsToAllOutOfDateAds}>UWAGA - mail do wszystkich</button>
                                </div>

                            </div>
                        </section>}

                </div>
            }

        </main >
    )
}

export default Ad
