import React, { useState, useEffect } from 'react'
import style from './Home.module.css'
import { firestore } from '../../shared/fire'

//components
import { ReactComponent as Question } from '../../assets/question.svg'

// data
import { cars, fuel, yearFrom, yearTo, gearbox, regions, cities } from '../../shared/data'

// constans
import { ADDS } from '../../shared/constans'




const Home = () => {


    useEffect(() => {

        // scroll to top when component render
        window.scrollTo(0, 0)

    }, [])


    // ----------------------- START FILTERS --------------------------//

    // STATE - set region
    const [regionChosen, setRegionChosen] = useState("")

    // STATE - set city
    const [cityChosen, setCityChosen] = useState("")

    // STATE - set car id (name)
    const [carIdChosen, setCarIdChosen] = useState("")

    // STATE - set car model
    const [carModelChosen, setCarModelChosen] = useState("")

    // STATE - set fuel
    const [fualChosen, setFuelChosen] = useState("")

    // STATE - set year from
    const [yearFromChosen, setYearFromChosen] = useState("")

    // STATE - set year to
    const [yearToChosen, setYearToChosen] = useState("")

    // STATE - set gearbox
    const [gearboxChosen, setGearboxChosen] = useState("")

    // set Regions on Change
    const setRegionChosenChandler = e => {
        setRegionChosen(e.target.value)
        setCityChosen("") // reset city when region change
    }

    // set Car ID on Change
    const setCarIdChosenChandler = e => {
        setCarIdChosen(e.target.value)
        setCarModelChosen("") // reset model when Car ID change
    }

    // filter adds
    const filterAdds = () => {

        console.log("filtrowanie");
    }

    // ----------------------- STOP FILTERS --------------------------//




    // ----------------------- START ADDS  --------------------------//



    // STATE - set ALL ADDS
    const [allAdds, setAllAdds] = useState([])

    useEffect(() => {

        //clear adds before load
        setAllAdds([])

        // listener for all adds
        const listener = firestore.collection(ADDS).onSnapshot( //have two arguments which are functions
            resp => resp.forEach(doc => {

                // get add with itemID from DB and save in State
                // console.log("doc: ", doc.data())
                setAllAdds(prevState => [...prevState, doc.data()])
            }),
            err => console.log(err.message))

        return () => {
            listener() // clean up listener
        }
    }, [])

    // ----------------------- STOP ADDS  --------------------------//




    return (
        <section className={style.background}>
            <div className={style.container}>


                {/* DESCRIPTION */}
                <div className={style.description}>

                    <div className={style.description__icon}>
                        <Question />
                    </div>
                    <div className={style.description__textContainer}>

                        <p className={style.description__title}>O co chodzi ... ?</p>
                        <p className={style.description__text}><strong>Szukasz używanego samochodu</strong> ale nie wiesz jaki model będzie odpowiedni dla Ciebie i Twojej rodziny? <strong>Testuj różne modele</strong>, zasięgnij opinii właścicieli i <strong>dokonaj świadomego wyboru.</strong></p>
                        <p className={style.description__text}><strong>Masz już samochód?</strong> Pokazuj go innym i przy okazji <strong>możesz zarabiać</strong>. Dodaj swoje auto do bazy i czekaj na zgłoszenie. Pokażesz swój samochód, opowiesz o nim i dostaniesz za to wcześniej ustaloną kwotę.</p>
                    </div>
                </div>


                {/* FILTERS */}
                <div className={style.filter}>
                    <p className={style.title}>Filtry</p>

                    <div className={style.filter__container}>
                        {/* Filter region */}
                        <div className={style.filter__itemContainer}>
                            <p className={style.filter__itemDesc}>Województwo:</p>
                            <select className={style.filter__itemList} onChange={setRegionChosenChandler}>
                                {regions.map(item => <option key={item} value={item}> {item} </option>)}
                            </select>
                        </div>
                        {/* Filter city */}
                        <div className={style.filter__itemContainer}>
                            <p className={style.filter__itemDesc}>Miasto:</p>
                            <select className={style.filter__itemList} onChange={e => setCityChosen(e.target.value)}>
                                {cities.filter(item => item.region === regionChosen).map(item => <option key={item.city} value={item.city}> {item.city} </option>)}
                            </select>
                        </div>
                    </div>

                    <div className={style.filter__container}>
                        {/* Filter cars id (name) */}
                        <div className={style.filter__itemContainer}>
                            <p className={style.filter__itemDesc}>Marka:</p>
                            <select className={style.filter__itemList} onChange={setCarIdChosenChandler}>
                                {cars.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                        {/* Filter cars model */}
                        <div className={style.filter__itemContainer}>
                            <p className={style.filter__itemDesc}>Model:</p>
                            <select className={style.filter__itemList} onChange={e => setCarModelChosen(e.target.value)}>
                                {cars.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                        {/* Filter fuel */}
                        <div className={style.filter__itemContainer}>
                            <p className={style.filter__itemDesc}>Paliwo:</p>
                            <select className={style.filter__itemList} onChange={e => setFuelChosen(e.target.value)}>
                                {fuel.map(item => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                        {/* Filter year */}
                        <div className={style.filter__itemContainer}>
                            <p className={style.filter__itemDesc}>Rok produkcji:</p>
                            <div className={style.filter__itemContainerItems}>
                                <select className={style.filter__itemList} onChange={e => setYearFromChosen(e.target.value)}>
                                    {yearFrom.map(item => <option key={item} value={item}>{item}</option>)}
                                </select>
                                <select className={style.filter__itemList} onChange={e => setYearToChosen(e.target.value)}>
                                    {yearTo.map(item => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </div>
                        </div>
                        {/* Filter gearbox */}
                        <div className={style.filter__itemContainer}>
                            <p className={style.filter__itemDesc}>Skrzynia biegów:</p>
                            <select className={style.filter__itemList} onChange={e => setGearboxChosen(e.target.value)}>
                                {gearbox.map(item => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </div>
                    </div>
                    <button className={style.btn} onClick={filterAdds}>Filtruj</button>
                </div>


                {/* ALL ADDS */}
                <div className={style.adds}>
                    <p className={style.title}>Ogłoszenia</p>

                    <div className={style.adds__itemsContainer}>
                        {allAdds.map(item => {
                            return (
                                <div key={item.id} className={style.adds__item}>

                                    <div className={style.adds__itemContainer}>
                                        <figure className={style.adds__itemFigure}>
                                            <img className={style.adds__itemImg} src={item.imageURL[0]} />
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

                                </div>
                            )
                        })
                        }

                    </div>

                </div>
            </div>
        </section>
    )
}

export default Home



