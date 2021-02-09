import React, { useState, useEffect } from 'react'
import style from './UserAds.module.css'
import { firestore } from '../../shared/fire'


//photos
import PhotoEmpty from '../../assets/photoEmpty.png'

// data
import { cars } from '../../shared/data'

// constans
import { ADS, USERS } from '../../shared/constans'



const UserAds = props => {


    // STATE - set ALL ADS
    const [allAds, setAllAds] = useState([])

    // load ads from DB
    useEffect(() => {

        console.log(props.location.state);

        //clear ads list before load
        setAllAds([])


        // load ads from DB
        const loadAdsFromDB = async () => {
            try {
                const firestoreGet = await firestore.collection(USERS).doc(props.location.state).collection(ADS).get()
                firestoreGet.forEach(doc => {
                    const firebaseGetEveryUserAd = async () => {
                        try {




                            // TODO zmienić ADS na odpowiednią bazę danych !!!






                            const firestoreGetUserAds = await firestore.collection(ADS).doc(doc.data().documentKey).get()
                            // eslint-disable-next-line no-unused-vars
                            const ex = firestoreGetUserAds.data().isApproved === true ? setAllAds(prevState => [...prevState, firestoreGetUserAds.data()]) : null // save only approved ads every ad in State
                        } catch (err) { console.log('err get ads in for each', err) }
                    }
                    firebaseGetEveryUserAd()
                })
            } catch (err) { console.log('err get ads', err) }

        }
        loadAdsFromDB()

        // firestore.collection(USERS).doc(props.location.state).collection("ADS").get()
        //     .then(resp => resp.forEach(doc => {
        //         firestore.collection(ADS).doc(doc.data().documentKey).get()
        //             .then(itemResp => itemResp.data().isApproved === true ? setAllAds(prevState => [...prevState, itemResp.data()]) : null) 
        //             .catch(err => console.log('err get ads in for each', err))
        //     }))
        //     .catch(err => console.log('err get ads', err))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (

        <section className={style.background}>
            <div className={style.container}>


                {/* ALL ADS */}
                <div className={style.ads}>
                    <p className={style.title}>Wszystkie ogłoszenia użytkownika</p>

                    <div className={style.ads__itemsContainer}>
                        {allAds.map(item => { // show only approved ads
                            return (
                                <a href={`/home/${item.documentKey}`} key={item.id} className={style.ads__item} >

                                    <div className={style.ads__itemContainer}>
                                        <figure className={style.ads__itemFigure}>
                                            <img className={style.ads__itemImg} src={item.imageURL[0] || PhotoEmpty} alt="main" />
                                        </figure>

                                        <div className={style.ads__itemDescContainer}>
                                            <div className={style.ads__itemDescTop}>
                                                <p className={style.ads__itemText}>{cars.find(i => i.id === item.carIdChosen).name}</p>
                                                <p className={style.ads__itemText}>{item.carModelChosen}</p>

                                            </div>

                                            <div className={style.ads__itemDescBottom}>
                                                <p className={style.ads__itemText}>{item.regionChosen}</p>
                                                <p className={style.ads__itemText}>{item.cityChosen}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={style.ads__itemDescRight} >
                                        <p className={style.ads__itemText}>{item.priceOfMeeting} zł/h</p>
                                    </div>
                                </a>
                            )
                        })
                        }

                    </div>

                </div>


            </div>
        </section>
    )
}

export default UserAds
