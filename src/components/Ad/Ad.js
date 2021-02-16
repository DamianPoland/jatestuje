import React, { useState, useEffect } from 'react'
import style from './Ad.module.css'


//firebase
import { firestore } from '../../shared/fire'


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
                    <div className={style.photos__section}>

                        <div className={style.photos__itemDescTopContainer}>
                            <p className={style.photos__itemTextTitle}>{oneAd.adTitle}</p>
                        </div>

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
                                <p className={style.photos__itemTextPrice}>{oneAd.priceOfMeeting} zł/h</p>
                                <div className={style.photos__itemDescRightContainerRegion}>
                                    <p className={style.photos__itemTextRegion}>woj. {oneAd.regionChosen},</p>
                                    <p className={style.photos__itemTextRegion}>Miasto: {oneAd.cityChosen}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* DESC params section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Dane:</p>
                        <div className={style.desc__container}>
                            {oneAd.carIdChosen && <p className={style.desc__text}>Marka: <b>{mainCategories[0].carBrands.find(i => i.id === oneAd.carIdChosen).name}</b></p>}
                            {oneAd.carModelChosen && <p className={style.desc__text}>Model: <b>{oneAd.carModelChosen}</b></p>}
                            {oneAd.yearChosen && <p className={style.desc__text}>Rok produkcji: <b>{oneAd.yearChosen}</b></p>}
                            {oneAd.fuelChosen && <p className={style.desc__text}>Paliwo: <b>{oneAd.fuelChosen}</b></p>}
                            {oneAd.gearboxChosen && <p className={style.desc__text}>Skrzynia biegów: <b>{oneAd.gearboxChosen}</b></p>}
                            {oneAd.mileageChosen && <p className={style.desc__text}>Przebieg: <b>{oneAd.mileageChosen} tyś. km.</b></p>}
                            {oneAd.typeChosen && <p className={style.desc__text}>Typ: <b>{oneAd.typeChosen}</b></p>}

                            {oneAd.equipmentChosen.length !== 0
                                && <div className={style.ad__container}>
                                    <fieldset className={style.ad__containerEquipment}>
                                        <legend className={style.ad__legendEquipment}>Wyposarzenie: </legend>

                                        {oneAd.equipmentChosen.map(item => {
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
                            <p className={style.desc__text}>Jak użytkownik ocenia swoją więdzę techniczną?: <b>{oneAd.techKnowledge}</b></p>
                            <p className={style.desc__text}>Zaproponowana przez użytkownika cena za godzinne spotkanie: <b>{oneAd.priceOfMeeting} zł/h</b></p>
                            <p className={style.desc__text}>Preferowana przez użytkownika pora spotkania: <b>{oneAd.timeOfDay}</b></p>
                        </div>
                    </div>

                    {/* DESC meet section */}
                    <div className={style.desc}>
                        <p className={style.desc__title}>Dane kontaktowe:</p>
                        <div className={style.desc__container}>
                            <div className={style.desc__containerUser}>
                                <figure className={style.desc__containerfigure}>
                                    <img className={style.desc__containerimg} src={oneAd.userPhoto} onError={(e) => { e.target.onerror = null; e.target.src = User }} alt="main" />
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

                            <a className={style.desc__containerContact} href={`/userads/${oneAd.userId}`} >
                                <div className={style.desc__svg}>
                                    <Cubes />
                                </div>
                                <p className={style.desc__textContact}>Zobacz inne ogłoszenia uzytkownika</p>
                            </a>
                        </div>
                    </div>



                </div>
            }




        </section >
    )
}

export default Ad
