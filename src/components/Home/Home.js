import React, { useState, useEffect } from 'react'
import style from './Home.module.css'
import { firestore } from '../../shared/fire'

// data
import { cars } from '../../shared/data'

// constans
import { CARS } from '../../shared/constans'

const Home = () => {


    useEffect(() => {

        // scroll to top when component render
        window.scrollTo(0, 0)

    }, [])



    return (
        <section className={style.background}>
            <div className={style.container}>


                {/* DESCRIPTION */}
                <div className={style.description}>
                    <p className={`${style.description__title} ${style.title}`}>O co chodzi ... ?</p>
                    <p className={style.description__text}>Szukasz używanego samochodu ale nie wiesz jaki model będzie odpowiedni dla Ciebie i Twojej rodziny? Testuj różne modele, zasięgnij opinii właścicieli i dokonaj świadomego wyboru.</p>
                    <p className={style.description__text}>Masz już samochód i chcesz go pokazać inny i przy okazji zarobić? Dodaj swoje auto do bazy i czakaj na zgłoszenie. Pokażesz swój samochód, opowiesz o nim i dostaniesz za to wcześniej ustaloną kwotę.</p>
                </div>


                {/* FILTERS */}
                <div className={style.filter}>
                    <p className={`${style.filter__title} ${style.title}`}>Filtry</p>
                    <div className={style.filter__container}>


                        <select>
                            {cars.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>

                        <select>
                            {cars.find(item => item.id === "bmw").models.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>


                        <p className={style.items__item}>Ogłoszenie 1</p>
                        <p className={style.items__item}>Ogłoszenie 2</p>
                    </div>
                </div>


                {/* ITEMS */}
                <div className={style.items}>
                    <p className={`${style.items__title} ${style.title}`}>Ogłoszenia</p>
                    <div className={style.items__container}>
                        <p className={style.items__item}>Ogłoszenie 1</p>
                        <p className={style.items__item}>Ogłoszenie 2</p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Home



