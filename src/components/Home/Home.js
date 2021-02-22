import React, { useState, useEffect } from 'react'
import style from './Home.module.css'
import { firestore } from '../../shared/fire'

// data
import { mainCategories, fuel, yearFrom, yearTo, gearbox, regions, cities } from '../../shared/data'

//component
import ListItemAd from '../ListItemAd/ListItemAd'





const Home = () => {

    // ----------------------- START CATEGORIES --------------------------//


    // STATE - set mainCategory
    const [mainCategory, setMainCategory] = useState(mainCategories[0].nameDB)


    // call when click new category
    const mainCategoryHandler = (nameDB) => {

        // reset array
        setAllAds([])

        //set new category
        setMainCategory(nameDB)

        //clear all states\
        setCarIdChosen("")
        setCarModelChosen("")
        setFuelChosen("")
        setYearFromChosen("")
        setYearToChosen("")
        setGearboxChosen("")
        setTypeChosen("")
    }

    // ----------------------- STOP CATEGORIES --------------------------//


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

    // STATE - set type
    const [typeChosen, setTypeChosen] = useState("")



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

    // ----------------------- STOP FILTERS --------------------------//




    // ----------------------- START ADS  --------------------------//

    // STATE - set ALL ADS
    const [allAds, setAllAds] = useState([])

    // load ads from DB first time
    useEffect(() => {

        // start query
        queryToDB(true)

    }, [mainCategory])



    // get ads with filters
    const filterAds = () => {

        // clear ads list
        setAllAds([])

        // query to DB
        queryToDB(true)
    }


    // query to DB for items
    const queryToDB = async (firstLoad = true) => {

        //set query constructor
        let queryConstructor = firestore.collection(mainCategory)

        // filters for car category only
        // carIdChosen && (queryConstructor = queryConstructor.where("carIdChosen", "==", `${carIdChosen}`))
        // carModelChosen && (queryConstructor = queryConstructor.where("carModelChosen", "==", `${carModelChosen}`))
        // fualChosen && (queryConstructor = queryConstructor.where("fualChosen", "==", `${fualChosen}`))
        // yearFromChosen && (queryConstructor = queryConstructor.where("yearChosen", ">=", `${yearFromChosen}`))
        // yearToChosen && (queryConstructor = queryConstructor.where("yearChosen", "<=", `${yearToChosen}`))
        // gearboxChosen && (queryConstructor = queryConstructor.where("gearboxChosen", "==", `${gearboxChosen}`))

        // filters use for all categories
        regionChosen && !cityChosen && (queryConstructor = queryConstructor.where("regionChosen", "==", `${regionChosen}`)) // region if city is empty
        cityChosen && (queryConstructor = queryConstructor.where("cityChosen", "==", `${cityChosen}`)) // only city - no region
        typeChosen && (queryConstructor = queryConstructor.where("typeChosen", "==", `${typeChosen}`))

        // main filters added always
        queryConstructor = queryConstructor.where("isApproved", "==", true) // only approwed ads
        queryConstructor = queryConstructor.orderBy("adDate", 'desc') // sort in field adDate, 'desc' - get from the bigest to smallest
        queryConstructor = queryConstructor.startAfter(firstLoad ? (new Date().getTime()) + 86400000 * 30 : allAds[allAds.length - 1].adDate) // get ads from newest (month in future 86400000 * 30) according to field adDate or last displayed
        queryConstructor = queryConstructor.limit(4) // how many items be loaded from DB on one time


        try {
            const query = await queryConstructor.get()

            query.forEach(doc => {

                // show ONLY ads valid, not older than today
                if (doc.data().adDate <= (new Date().getTime())) { return }

                // add new ads to State
                setAllAds(prevState => [...prevState, doc.data()])

                // promoted ad put extra on top, change id because Each child in a list should have a unique "key"
                if (doc.data().isPromoted === true) {
                    const item = { ...doc.data() }
                    item.id = `${item.id} ` // add only space because can't change url in browser to ad
                    setAllAds(prevState => [item, ...prevState])
                }
            })
        } catch (err) { console.log('err get ads', err) }
    }

    // ----------------------- STOP ADS  --------------------------//



    return (
        <section className={style.background}>
            <div className={style.container}>

                {/* DESCRIPTION */}
                <div className={style.description}>

                    <p className={style.description__title}>O co chodzi ... ?</p>
                    <div className={style.description__textContainer}>
                        <p className={style.description__text}><strong>Szukasz samochodu, motocykla, maszyny lub urzadzenia elektronicznego</strong> ale nie wiesz jaki model będzie dla Ciebie odpowiedni? <strong>Testuj różne modele</strong>, zasięgnij opinii właścicieli i <strong>dokonaj świadomego wyboru.</strong></p>
                        <p className={style.description__text}><strong>Masz już samochód lub jakieś urządzenie elektroniczne?</strong> Pokaż innym i przy okazji <strong>możesz zarobić</strong>. Dodaj go do bazy i czekaj na zgłoszenie. Pokażesz swóją własność, opowiesz o niej i dostaniesz za to wcześniej ustaloną kwotę.</p>
                    </div>
                </div>


                {/* MAIN CATEGORY */}
                <div className={style.categories}>
                    <p className={style.title}>Kategorie</p>
                    <div className={style.categories__container}>
                        {mainCategories.map(item => {
                            return (
                                <div key={item.nameDB} className={`${style.categories__itemContainer} ${(mainCategory === item.nameDB) && style.categories__itemContainerActive}`} onClick={() => mainCategoryHandler(item.nameDB)}>
                                    <figure className={style.categories__itemFigure}>
                                        <img className={style.categories__itemImg} src={item.photo} alt="main" />
                                    </figure>
                                    <p className={style.categories__itemDesc}>{item.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>


                {/* FILTERS */}
                <div className={style.filter}>
                    <p className={style.title}>Filtry</p>
                    <div className={style.filter_container}>

                        <div className={style.filter__itemContainer}>
                            {/* Filter region */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Województwo:</p>
                                <select className={style.filter__itemList} onChange={setRegionChosenChandler}>
                                    {regions.map(item => <option key={item} value={item}> {item} </option>)}
                                </select>
                            </div>
                            {/* Filter city */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Miasto:</p>
                                <select className={style.filter__itemList} onChange={e => setCityChosen(e.target.value)}>
                                    {cities.filter(item => item.region === regionChosen).map(item => <option key={item.city} value={item.city}> {item.city} </option>)}
                                </select>
                            </div>
                        </div>


                        {/* Filter cars car brand */}
                        < div className={style.filter__itemContainer}>
                            {mainCategory === mainCategories[0].nameDB
                                &&
                                <div className={style.filter__itemContainerForCar}>
                                    {/* Filter cars id (name) */}
                                    <div className={style.filter__itemContainerSmall}>
                                        <p className={style.filter__itemDesc}>Marka:</p>
                                        <select className={style.filter__itemList} onChange={setCarIdChosenChandler}>
                                            {mainCategories[0].carBrands.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                    </div>

                                    {/* Filter cars model */}
                                    <div className={style.filter__itemContainerSmall}>
                                        <p className={style.filter__itemDesc}>Model:</p>
                                        <select className={style.filter__itemList} onChange={e => setCarModelChosen(e.target.value)}>
                                            {mainCategories[0].carBrands.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    {/* Filter fuel */}
                                    <div className={style.filter__itemContainerSmall}>
                                        <p className={style.filter__itemDesc}>Paliwo:</p>
                                        <select className={style.filter__itemList} onChange={e => setFuelChosen(e.target.value)}>
                                            {fuel.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                    {/* Filter year */}
                                    <div className={style.filter__itemContainerSmall}>
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
                                    <div className={style.filter__itemContainerSmall}>
                                        <p className={style.filter__itemDesc}>Skrzynia biegów:</p>
                                        <select className={style.filter__itemList} onChange={e => setGearboxChosen(e.target.value)}>
                                            {gearbox.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>
                                </div>
                            }

                            {/* Filter type */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Typ:</p>
                                <select className={style.filter__itemList} onChange={e => setTypeChosen(e.target.value)}>
                                    {mainCategories.find(i => mainCategory === i.nameDB).type.map(item => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className={style.btnContainer}>
                            <button className={style.btn} onClick={filterAds}>Filtruj</button>
                        </div>
                    </div>
                </div>


                {/* ALL ADS */}
                <div className={style.ads}>
                    <p className={style.title}>Ogłoszenia</p>

                    {allAds.length !== 0
                        ? <div>
                            {allAds.map((item) => {
                                return (
                                    <ListItemAd key={item.id} item={item} />
                                )
                            })
                            }
                            <div className={style.btnContainerBottom}>
                                <button className={style.btn} onClick={() => queryToDB(false)}>Następne</button>
                            </div>
                        </div>

                        : <p>brak</p>
                    }

                </div>
            </div>

        </section >
    )
}

export default Home



