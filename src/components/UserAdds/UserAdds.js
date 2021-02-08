import React, { useState, useEffect } from 'react'
import style from './UserAdds.module.css'
import { firestore } from '../../shared/fire'


//photos
import PhotoEmpty from '../../assets/photoEmpty.png'

// data
import { cars } from '../../shared/data'

// constans
import { ADDS, USERS } from '../../shared/constans'



const UserAdds = props => {


    // STATE - set ALL ADDS
    const [allAdds, setAllAdds] = useState([])

    // load adds from DB
    useEffect(() => {

        console.log(props.location.state);

        //clear adds list before load
        setAllAdds([])

        // load adds from DB
        firestore.collection(USERS).doc(props.location.state).collection(ADDS).get()
            .then(resp => resp.forEach(doc => {





                // TODO zmienić ADDS na odpowiednią bazę danych !!!


                firestore.collection(ADDS).doc(doc.data().itemID).get()
                    .then(itemResp => itemResp.data().isApproved === true ? setAllAdds(prevState => [...prevState, itemResp.data()]) : null) // save only approved adds every add in State
                    .catch(err => console.log('err get adds in for each', err))
            }))
            .catch(err => console.log('err get adds', err))
    }, [])


    return (

        <section className={style.background}>
            <div className={style.container}>


                {/* ALL ADDS */}
                <div className={style.adds}>
                    <p className={style.title}>Wszystkie ogłoszenia użytkownika</p>

                    <div className={style.adds__itemsContainer}>
                        {allAdds.map(item => { // show only approved adds
                            return (
                                <a href={`/home/${item.id}`} key={item.id} className={style.adds__item} >

                                    <div className={style.adds__itemContainer}>
                                        <figure className={style.adds__itemFigure}>
                                            <img className={style.adds__itemImg} src={item.imageURL[0] || PhotoEmpty} alt="main" />
                                        </figure>

                                        <div className={style.adds__itemDescContainer}>
                                            <div className={style.adds__itemDescTop}>
                                                <p className={style.adds__itemText}>{cars.find(i => i.id === item.carIdChosen).name}</p>
                                                <p className={style.adds__itemText}>{item.carModelChosen}</p>

                                            </div>

                                            <div className={style.adds__itemDescBottom}>
                                                <p className={style.adds__itemText}>{item.regionChosen}</p>
                                                <p className={style.adds__itemText}>{item.cityChosen}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={style.adds__itemDescRight} >
                                        <p className={style.adds__itemText}>{item.priceOfMeeting} zł/h</p>
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

export default UserAdds
