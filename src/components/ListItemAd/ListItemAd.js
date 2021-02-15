import React from 'react'
import style from './ListItemAd.module.css'

//photos
import PhotoEmpty from '../../assets/photoEmpty.png'



const ListItemAd = ({ item }) => {
    return (
        <a href={`/home/${item.documentKey}`} className={style.ads__item} >

            <div className={style.ads__itemContainer}>
                <figure className={style.ads__itemFigure}>
                    <img className={style.ads__itemImg} src={item.imageURL[0] || PhotoEmpty} alt="main" />
                </figure>

                <div className={style.ads__itemDescContainer}>
                    <div className={style.ads__itemDescTop}>
                        <p className={style.ads__itemText}>{item.adTitle}</p>
                    </div>

                    {item.isPromoted && <p className={style.ads__itemText}>promowane</p>}

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
}

export default ListItemAd
