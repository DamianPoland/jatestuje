import React from 'react'
import style from './Footer.module.css'
import logo from '../../assets/logoStudioWWW.png'

//components
import { ReactComponent as Facebook } from '../../assets/facebook.svg'
import { ReactComponent as YouTube } from '../../assets/youtube.svg'
import { ReactComponent as Instagram } from '../../assets/instagram.svg'



const Footer = () => {
    return (
        <div className={style.background}>
            <div className={style.line}></div>
            <div className={style.container}>

                <div className={style.column}>
                    <a href='http://jatestuje.pl' target='blank' className={style.socialMedia}> <div className={style.logo}><YouTube /></div><p className={style.text}>YouTube</p></a>
                    <a href='http://jatestuje.pl' target='blank' className={style.socialMedia}> <div className={style.logo}><Facebook /></div><p className={style.text}>Facebook</p></a>
                    <a href='http://jatestuje.pl' target='blank' className={style.socialMedia}> <div className={style.logo}><Instagram /></div><p className={style.text}>Instagram</p></a>
                </div>
                <div className={style.column}>
                    <a href='/privacy-policy' className={style.text} target='blank'>Polityka prywatności</a>
                    <a href='/regulations' className={style.text} target='blank'>Regulamin</a>
                    <a href='/contact' className={style.text} target='blank'>Kontakt</a>
                </div>

                <div className={style.column}>
                    <p className={style.text}>Copyright © jaTestuje.pl 2021</p>
                    <a href='https://studio-www.com' target='blank' className={`${style.designedBy} ${style.link}`}>
                        <span className={`${style.text} ${style.textLeft}`}>Designed by</span>
                        <img className={style.logo} src={logo} alt='logo' />
                        <span className={`${style.text} ${style.textRight}`}>studio-www.com</span>
                    </a>
                </div>

            </div>
        </div>
    )
}

export default Footer