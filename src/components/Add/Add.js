import React, { useState, useEffect } from 'react'
import style from './Add.module.css'

//firebase
import { firestore } from '../../shared/fire'

// constans
import { ADDS } from '../../shared/constans'

const Add = props => {


    // STATE - set one ADD
    const [oneAdd, setOneAdd] = useState()

    useEffect(() => {

        // get add with itemID from DB and save in State
        firestore.collection(ADDS).doc(props.match.params.key).get()
            .then(resp => {
                setOneAdd(resp.data())
                console.log("resp: ", resp.data());

            })
            .catch(err => console.log('listener err', err))
    }, [])



    return (
        <section className={style.background}>
            {oneAdd &&
                <div className={style.container}>

                    <div className={style.photos}>

                        <div className={style.photos__container}>
                            <figure className={style.photos__figureBig}>
                                <img className={style.photos__img} src={oneAdd.imageURL[0]} alt="main" />
                            </figure>
                            <div className={style.photos__containerSmall}>
                                {oneAdd.imageURL.map((item, id) => {
                                    return (
                                        <figure className={style.photos__figureSmall} key={id}>
                                            <img className={style.photos__img} src={item} alt={`main${id}`} />
                                        </figure>
                                    )
                                })}
                            </div>
                        </div>


                        <div>

                            <p>{oneAdd.id}</p>
                        </div>
                    </div>
                </div>
            }




        </section>
    )
}

export default Add
