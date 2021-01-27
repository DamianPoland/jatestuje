import React, { useState, useEffect } from 'react'
import style from './User.module.css'

//components
import LoginRegisterFirebaseUI from './LoginRegisterFirebaseUI/LoginRegisterFirebaseUI'

//firebase
import { auth } from '../../shared/fire'

// constans
import { IS_AUTH, USER_NAME, USER_EMAIL } from '../../shared/constans'


const helpArray = ['ogłoszenie 1', 'ogłoszenie 2', 'ogłoszenie 3',]

const User = props => {


    useEffect(() => {

        // scroll to top when component render
        window.scrollTo(0, 0)

    }, [])


    // log out button
    const handlerLogOut = () => {
        auth.signOut() // sign out
        props.history.replace('/home') // go to /home
    }


    // ----------------------- START ADD ITEM --------------------------//

    // STATE - is Adding Item
    const [isAddingItem, setIsAddingItem] = useState(false)

    // add item to DB
    const addItemToDB = () => {

        console.log("addItemToDB");
    }

    // ----------------------- STOP ADD ITEM --------------------------//


    return (
        JSON.parse(localStorage.getItem(IS_AUTH))

            // user Log In
            ? <section className={style.background}>
                <div className={style.container}>

                    {isAddingItem
                        ?

                        // adding item
                        <div>

                            <p>dodawanie</p>

                            <div className={style.btnContainer}>
                                <button className={`${style.btn} ${style.btnMmargin}`} onClick={() => setIsAddingItem(false)}>Anuluj</button>
                                <button className={style.btn} onClick={addItemToDB}>Dodaj</button>
                            </div>
                        </div>



                        // all items
                        : <div>
                            <p className={style.user__title}>Witaj {localStorage.getItem(USER_NAME)}</p>
                            <p className={style.user__itemsDesc}>Twoje ogłoszenia:</p>



                            <div className={style.user__itemsContainer}>
                                {helpArray.map(item => {
                                    return (
                                        <p key={item} className={style.user__item}>{item}</p>
                                    )
                                })

                                }
                                <button className={style.btn} onClick={() => setIsAddingItem(true)}>Dodaj</button>
                            </div>



                            <div className={style.btnContainer}>
                                <button className={style.btn} onClick={handlerLogOut}>Wyloguj z konta: {localStorage.getItem(USER_EMAIL)}</button>
                            </div>
                        </div>

                    }


                </div>
            </section >

            // user log out
            : <LoginRegisterFirebaseUI />
    )
}

export default User
