import React, { useState, useEffect } from 'react'
import style from './UserAds.module.css'
import { firestore } from '../../shared/fire'

// constans
import { ADS, USERS } from '../../shared/constans'

//component
import ListItemAd from '../ListItemAd/ListItemAd'
import AlertSmall from "../../UI/AlertSmall/AlertSmall"
import Spinner from '../../UI/Spinner/Spinner'



const UserAds = props => {

    // show or hide small alert
    const [isAlertSmallShow, setIsAlertSmallShow] = useState(false)

    // Spinner
    const [isMainSpinnerShow, setIsMainSpinnerShow] = useState(false)

    // STATE - set ALL ADS
    const [allAds, setAllAds] = useState([])

    // load ads from DB
    useEffect(() => {

        //clear ads list before load
        setAllAds([])

        // show main spinner
        setIsMainSpinnerShow(true)

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

                        } catch (err) {

                            // show alert Error
                            setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                            console.log('err get ads: ', err)

                        } finally {

                            // when is last item then turn of spinner
                            if (doc === getUserAdsArray[getUserAdsArray.length - 1]) {

                                // hide main spinner
                                setIsMainSpinnerShow(false)
                            }
                        }
                    }
                    firebaseGetEveryUserAd()
                })
            } catch (err) {

                // show alert Error
                setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
                console.log('err get ads', err)

                // hide main spinner
                setIsMainSpinnerShow(false)
            }

        }
        loadAdsFromDB()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (

        <section className={style.background}>
            {isMainSpinnerShow && <Spinner />}

            {/* AlertSmall */}
            {isAlertSmallShow && <AlertSmall alertIcon={isAlertSmallShow.alertIcon} description={isAlertSmallShow.description} animationTime={isAlertSmallShow.animationTime} borderColor={isAlertSmallShow.borderColor} hide={() => setIsAlertSmallShow(false)} />}

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
