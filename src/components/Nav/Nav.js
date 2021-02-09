import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import style from './Nav.module.css'
import logo from '../../assets/logo512.png'

//firebase
import { auth } from '../../shared/fire'


// constans
import { IS_AUTH } from '../../shared/constans'




const Nav = ({ isLogin }) => {

    // show hide log out button and change my account to ad
    const [isLoginFromStorage, setIsLoginFromStorage] = useState(false)
    useEffect(() => {
        setIsLoginFromStorage(localStorage.getItem(IS_AUTH))
    }, [isLogin])


    // open & close mobile menu
    const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
    let styleMobileMenu = isOpenMobileMenu ? style.listOpen : '' //menu list close/open
    let styleMobileButtonBurger = isOpenMobileMenu ? style.burgerOpen : '' //button burger close/open



    return (
        <header className={style.background}>
            <nav className={style.container}>
                <div className={style.header}>
                    <img className={style.headerImg} src={logo} alt='logo' />
                    <p className={style.headerDesc}>jaTestuje.pl</p>
                </div>
                <ul onClick={() => setIsOpenMobileMenu(false)} className={`${style.list} ${styleMobileMenu}`}>
                    <li className={style.listItem}><NavLink to='/home' activeClassName={style.activeLink} className={style.listItemAnchor}>Ogłoszenia</NavLink></li>


                    {/* ad or user acount */}
                    {isLoginFromStorage
                        ? <li className={style.listItem}><NavLink to='/user' activeClassName={style.activeLink} className={style.listItemAnchor}>Moje konto</NavLink></li>
                        : <li className={style.listItem}><NavLink to='/user' className={style.listItemAnchorAd}>Dodaj ogłoszenie</NavLink></li>
                    }

                    {/* sign out button*/}
                    {isLoginFromStorage
                        && <li className={style.listItem}><NavLink to='/home' onClick={() => auth.signOut()} className={style.listItemAnchor}>Wyloguj</NavLink></li>}
                </ul>
                <div onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)} className={`${style.burgerMenu} ${styleMobileButtonBurger}`}>
                    <div className={style.burgerBtn}></div>
                </div>

            </nav>
        </header>
    )
}

export default Nav