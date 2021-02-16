import React, { useState, useEffect } from 'react'
import style from './UserAds.module.css'
import { firestore } from '../../shared/fire'

// constans
import { ADS, USERS } from '../../shared/constans'

//component
import ListItemAd from '../ListItemAd/ListItemAd'



const UserAds = props => {


    // STATE - set ALL ADS
    const [allAds, setAllAds] = useState([])

    // load ads from DB
    useEffect(() => {

        //clear ads list before load
        setAllAds([])

        // load ads from DB
        const loadAdsFromDB = async () => {
            try {

                // get user adds from DB with ad id
                const getUserAds = await firestore.collection(USERS).doc(props.match.params.key).collection(ADS).doc(ADS).get()

                // change for array of ads id
                const getUserAdsArray = Object.values(getUserAds.data())

                // get all user ads by collection userEmail
                getUserAdsArray.forEach(doc => {
                    const firebaseGetEveryUserAd = async () => {
                        try {
                            const firestoreGetUserAds = await firestore.collection(doc.split(" ")[0]).doc(doc).get()
                            // eslint-disable-next-line no-unused-vars
                            const ex = firestoreGetUserAds.data().isApproved === true ? setAllAds(prevState => [...prevState, firestoreGetUserAds.data()]) : null // save only approved ads every ad in State
                        } catch (err) { console.log('err get ads: ', err) }
                    }
                    firebaseGetEveryUserAd()
                })
            } catch (err) { console.log('err get ads', err) }

        }
        loadAdsFromDB()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (

        <section className={style.background}>
            <div className={style.container}>


                {/* ALL ADS */}
                <div className={style.ads}>
                    <p className={style.title}>Wszystkie ogłoszenia użytkownika</p>
                    {allAds.map(item => { // show only approved ads
                        return (
                            <ListItemAd key={item.id} item={item} />
                        )
                    })
                    }
                </div>
            </div>
        </section>
    )
}

export default UserAds
