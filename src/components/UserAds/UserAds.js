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

        console.log("props.match.params.key", props.match.params.key);

        //clear ads list before load
        setAllAds([])


        // load ads from DB
        const loadAdsFromDB = async () => {
            try {

                // get user adds from DB with documentKey
                const getUserAds = await firestore.collection(USERS).doc(props.match.params.key).collection(ADS).doc(ADS).get()

                // change for array of ads documentKey
                const getUserAdsArray = Object.values(getUserAds.data())

                // get all user ads by collection userEmail
                getUserAdsArray.forEach(doc => {
                    const firebaseGetEveryUserAd = async () => {
                        try {
                            const firestoreGetUserAds = await firestore.collection(doc.split(" ")[0]).doc(doc).get()
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
