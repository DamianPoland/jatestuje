import React, { useState, useEffect } from 'react'
import style from './Ad.module.css'


//firebase
import { firestore } from '../../shared/fire'


//photos images svg
import PhotoEmpty from '../../assets/photoEmpty.png'
import User from '../../assets/user.png'
import { ReactComponent as Phone } from '../../assets/phone.svg'
import { ReactComponent as Email } from '../../assets/email.svg'
import { ReactComponent as Location } from '../../assets/location.svg'
import { ReactComponent as Cubes } from '../../assets/cubes.svg'



// data
import { cars } from '../../shared/data'


const Ad = props => {


    // STATE - set one AD
    const [oneAd, setOneAd] = useState()

    // STATE - set main photo
    const [mainPhoto, setMainPhoto] = useState()

    useEffect(() => {

        // get ad with itemID from DB and save in State
        firestore.collection(props.match.params.key.split(" ")[0]).doc(props.match.params.key).get()
            .then(resp => {
                setOneAd(resp.data())

                // set first photo as mine
                setMainPhoto(resp.data().imageURL[0])

            })
            .catch(err => console.log('listener err', err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <section className={style.background}>
            {oneAd &&
                <div className={style.container}>

                    {/* photos section */}
                    <div className={style.photos}>

                        <div className={style.photos__container}>

                            <figure className={style.photos__figureBig}>
                                <img className={style.photos__imgBig} src={mainPhoto || PhotoEmpty} alt="main" />
                            </figure>

                            <div className={style.photos__containerSmall}>
                                {oneAd.imageURL.map((item, id) => {
                                    return (
                                        <figure className={`${style.photos__figureSmall} ${mainPhoto === item && style.photos__figureSmallBorder}`} key={id}>
                                            <img onClick={() => setMainPhoto(item)} className={style.photos__imgSmall} src={item || PhotoEmpty} alt={`main${id}`} />
                                        </figure>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={style.photos__descRight}>
                            <div className={style.photos__itemDescRightContainer}>
                                <p className={style.photos__itemTextCar}>{cars.find(i => i.id === oneAd.carIdChosen).name}</p>
                                <p className={style.photos__itemTextCar}>{oneAd.carModelChosen}</p>

                            </div>
                            <p className={style.photos__itemTextPrice}>{oneAd.priceOfMeeting} zł/h</p>

                            <div className={style.photos__itemDescRightContainerRegion}>
                                <p className={style.photos__itemTextRegion}>woj. {oneAd.regionChosen},</p>
                                <p className={style.photos__itemTextRegion}>Miasto: {oneAd.cityChosen}</p>
                            </div>
                        </div>
                    </div>


                    {/* DESC params section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Dane pojazdu:</p>
                        <div className={style.desc__container}>
                            <p className={style.desc__text}>Marka: <b>{cars.find(i => i.id === oneAd.carIdChosen).name}</b></p>
                            <p className={style.desc__text}>Model: <b>{oneAd.carModelChosen}</b></p>
                            <p className={style.desc__text}>Rok produkcji: <b>{oneAd.yearChosen}</b></p>
                            <p className={style.desc__text}>Paliwo: <b>{oneAd.fuelChosen}</b></p>
                            <p className={style.desc__text}>Skrzynia biegów: <b>{oneAd.gearboxChosen}</b></p>
                            <p className={style.desc__text}>Przebieg: <b>{oneAd.mileageChosen} tyś. km.</b></p>
                            <p className={style.desc__text}>Typ: <b>{oneAd.typeChosen}</b></p>
                        </div>
                    </div>


                    {/* DESC meet section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Opis użytkownika:</p>
                        <div className={style.desc__container}>
                            <p className={style.desc__text}>{oneAd.inputDescription}</p>
                        </div>
                    </div>

                    {/* DESC meet section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Spotkanie:</p>
                        <div className={style.desc__container}>
                            <p className={style.desc__text}>Jak użytkownik ocenia swoją więdzę techniczną na temat samochodu?: <b>{oneAd.techKnowledge}</b></p>
                            <p className={style.desc__text}>Czy istnieje możliwość, aby oglądający sam poprowadził samochód?: <b>{oneAd.choiceDriver}</b></p>
                            <p className={style.desc__text}>Zaproponowana przez użytkownika cena za godzinne spotkanie wliczając około 10 km przejażdżkę w złotówkach: <b>{oneAd.priceOfMeeting} zł/h</b></p>
                            <p className={style.desc__text}>Preferowana przez użytkownika pora spotkania: <b>{oneAd.timeOfDay}</b></p>
                        </div>
                    </div>

                    {/* DESC meet section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Dane kontaktowe:</p>
                        <div className={style.desc__container}>
                            <div className={style.desc__containerUser}>
                                <figure className={style.desc__containerfigure}>
                                    <img className={style.desc__containerimg} src={oneAd.userPhoto || User} alt="main" />
                                </figure>
                                <p className={style.desc__textName}>{oneAd.inputName}</p>
                            </div>

                            <a className={style.desc__containerContact} href={`http://maps.google.com/?q=${oneAd.cityChosen}`} target='blank' >
                                <div className={style.desc__svg}>
                                    <Location />
                                </div>
                                <p className={style.desc__textContact}>{oneAd.cityChosen}&nbsp;</p>
                                <p className={style.desc__textContact}>(woj. {oneAd.regionChosen})</p>
                            </a>

                            <a className={style.desc__containerContact} href={`mailto:${oneAd.inputEmail}?subject=Ogłoszenie z portalu jaTestuje.pl`}>
                                <div className={style.desc__svg}>
                                    <Email />
                                </div>
                                <p className={style.desc__textContact}>e-mail: {oneAd.inputEmail}</p>
                            </a>

                            <a className={style.desc__containerContact} href={`tel:${oneAd.inputPhone}`}>
                                <div className={style.desc__svg}>
                                    <Phone />
                                </div>
                                <p className={style.desc__textContact}>tel: {oneAd.inputPhone}</p>
                            </a>

                            <div className={style.desc__containerContact} onClick={() => console.log(props.history.push('/userads', oneAd.userEmail))}>
                                <div className={style.desc__svg}>
                                    <Cubes />
                                </div>
                                <p className={style.desc__textContact}>Zobacz inne ogłoszenia uzytkownika</p>
                            </div>
                        </div>
                    </div>



                </div>
            }




        </section >
    )
}

export default Ad
