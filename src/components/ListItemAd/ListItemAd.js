import React from 'react'
import { Link } from 'react-router-dom'
import style from './ListItemAd.module.css'

//photos
import PhotoEmpty from '../../assets/photoEmpty.png'



const ListItemAd = ({ item }) => {
    return (
        <Link to={`/offer/${item.adData.id}`} className={style.ads__item} >

            <div className={style.ads__itemContainer}>
                <figure className={style.ads__itemFigure}>
                    <img className={style.ads__itemImg} src={item.itemDescription.smallImageURL || PhotoEmpty} onError={(e) => { e.target.onerror = null; e.target.src = PhotoEmpty }} alt="main" />
                </figure>

                <div className={style.ads__itemDescContainer}>
                    <div className={style.ads__itemDescTop}>
                        <p className={style.ads__itemText}>{item.itemDescription.adTitle}</p>
                    </div>

                    {item.adData.isPromoted && <p className={style.ads__itemText}>promowane</p>}

                    <div className={style.ads__itemDescBottom}>
                        <p className={style.ads__itemText}>{item.userData.regionChosen}</p>
                        <p className={style.ads__itemText}>{item.userData.cityChosen}</p>
                    </div>
                </div>
            </div>

            <div className={style.ads__itemDescRight} >
                <p className={style.ads__itemText}>{item.meetingDescription.priceOfMeeting} zł/h</p>
            </div>
        </Link>
    )
}

export default ListItemAd
