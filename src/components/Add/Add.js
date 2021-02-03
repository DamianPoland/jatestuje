import React, { useState, useEffect } from 'react'
import style from './Add.module.css'

//firebase
import { firestore } from '../../shared/fire'

// constans
import { ADDS } from '../../shared/constans'

//photos
import PhotoEmpty from '../../assets/photoEmpty.png'
import User from '../../assets/user.png'
import { ReactComponent as Phone } from '../../assets/phone.svg'
import { ReactComponent as Email } from '../../assets/email.svg'
import { ReactComponent as Location } from '../../assets/location.svg'


// data
import { cars } from '../../shared/data'



const Add = props => {


    // STATE - set one ADD
    const [oneAdd, setOneAdd] = useState()

    // STATE - set main photo
    const [mainPhoto, setMainPhoto] = useState()

    useEffect(() => {

        // get add with itemID from DB and save in State
        firestore.collection(ADDS).doc(props.match.params.key).get()
            .then(resp => {
                setOneAdd(resp.data())
                console.log("resp: ", resp.data());

                // set first photo as mine
                setMainPhoto(resp.data().imageURL[0])

            })
            .catch(err => console.log('listener err', err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <section className={style.background}>
            {oneAdd &&
                <div className={style.container}>

                    {/* photos section */}
                    <div className={style.photos}>

                        <div className={style.photos__container}>

                            <figure className={style.photos__figureBig}>
                                <img className={style.photos__imgBig} src={mainPhoto || PhotoEmpty} alt="main" />
                            </figure>

                            <div className={style.photos__containerSmall}>
                                {oneAdd.imageURL.map((item, id) => {
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
                                <p className={style.photos__itemTextCar}>{cars.find(i => i.id === oneAdd.carIdChosen).name}</p>
                                <p className={style.photos__itemTextCar}>{oneAdd.carModelChosen}</p>

                            </div>
                            <p className={style.photos__itemTextPrice}>{oneAdd.priceOfMeeting} zł/h</p>

                            <div className={style.photos__itemDescRightContainerRegion}>
                                <p className={style.photos__itemTextRegion}>woj. {oneAdd.regionChosen},</p>
                                <p className={style.photos__itemTextRegion}>Miasto: {oneAdd.cityChosen}</p>
                            </div>
                        </div>
                    </div>


                    {/* DESC params section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Dane pojazdu:</p>
                        <div className={style.desc__container}>
                            <p className={style.desc__text}>Marka: {cars.find(i => i.id === oneAdd.carIdChosen).name}</p>
                            <p className={style.desc__text}>Model: {oneAdd.carModelChosen}</p>
                            <p className={style.desc__text}>Rok produkcji: {oneAdd.yearChosen}</p>
                            <p className={style.desc__text}>Paliwo: {oneAdd.fuelChosen}</p>
                            <p className={style.desc__text}>Skrzynia biegów: {oneAdd.gearboxChosen}</p>
                        </div>
                    </div>


                    {/* DESC meet section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Spotkanie:</p>
                        <div className={style.desc__container}>
                            <p className={style.desc__text}>Opis użytkownika: {oneAdd.inputDescription}</p>
                            <p className={style.desc__text}>Jak użytkownik ocenia swoją więdzę techniczną na temat samochodu?: {oneAdd.techKnowledge}</p>
                            <p className={style.desc__text}>Czy istnieje możliwość, aby oglądający sam poprowadził samochód?: {oneAdd.choiceDriver}</p>
                            <p className={style.desc__text}>Zaproponowana przez użytkownika cena za godzinne spotkanie wliczając około 10 km przejażdżkę w złotówkach: {oneAdd.priceOfMeeting}zł</p>
                            <p className={style.desc__text}>Preferowana przez użytkownika pora spotkania: {oneAdd.timeOfDay}</p>
                        </div>
                    </div>

                    {/* DESC meet section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Dane kontaktowe:</p>
                        <div className={style.desc__container}>
                            <div className={style.desc__containerUser}>
                                <figure className={style.desc__containerfigure}>
                                    <img className={style.desc__containerimg} src={oneAdd.userPhoto || User} alt="main" />
                                </figure>
                                <p className={style.desc__textName}>{oneAdd.inputName}</p>
                            </div>

                            <a className={style.desc__containerContact} href={`http://maps.google.com/?q=${oneAdd.cityChosen}`} target='blank' >
                                <div className={style.desc__svg}>
                                    <Location />
                                </div>
                                <p className={style.desc__textContact}>{oneAdd.cityChosen}&nbsp;</p>
                                <p className={style.desc__textContact}>(woj. {oneAdd.regionChosen})</p>
                            </a>

                            <a className={style.desc__containerContact} href={`mailto:${oneAdd.inputEmail}?subject=Ogłoszenie z portalu jaTestuje.pl`}>
                                <div className={style.desc__svg}>
                                    <Email />
                                </div>
                                <p className={style.desc__textContact}>e-mail: {oneAdd.inputEmail}</p>
                            </a>
                            <a className={style.desc__containerContact} href={`tel:${oneAdd.inputPhone}`}>
                                <div className={style.desc__svg}>
                                    <Phone />
                                </div>
                                <p className={style.desc__textContact}>tel: {oneAdd.inputPhone}</p>
                            </a>
                        </div>
                    </div>



                </div>
            }




        </section >
    )
}

export default Add
