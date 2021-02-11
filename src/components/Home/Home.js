import React, { useState, useEffect } from 'react'
import style from './Home.module.css'
import { firestore } from '../../shared/fire'

// data
import { mainCategories, cars, fuel, yearFrom, yearTo, gearbox, type, regions, cities } from '../../shared/data'


//photos
import PhotoEmpty from '../../assets/photoEmpty.png'




const Home = props => {


    // useEffect(() => {

    //     // scroll to top when component render
    //     window.scrollTo(0, 0)

    // }, [])

    // ----------------------- START CATEGORIES --------------------------//


    // STATE - set mainCategory
    const [mainCategory, setMainCategory] = useState(mainCategories[0].nameDB)

    useEffect(() => {


    }, [])



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




    // filter ads
    const filterAds = () => {

        // filters arguments list TODO
        const filterArgList = [regionChosen, cityChosen, carIdChosen, carModelChosen, fualChosen, yearFromChosen, yearToChosen, gearboxChosen, typeChosen]

        console.log("filtrowanie, lista: ", filterArgList);
    }

    // ----------------------- STOP FILTERS --------------------------//




    // ----------------------- START ADS  --------------------------//

    // STATE - set ALL ADS
    const [allAds, setAllAds] = useState([])

    // load ads from DB first time
    useEffect(() => {

        // start query
        queryToDB()

    }, [mainCategory])


    // query to DB for items
    const queryToDB = async () => {

        // reset array
        setAllAds([])

        //set query constructor
        const queryConstructor = firestore.collection(mainCategory)



        console.log(mainCategory);

        //  custom filters TODO
        // .where("regionChosen", "==", "pomorskie")
        // .where("carIdChosen", "==", "bmw")



        try {

            const query = await queryConstructor

                // main filters
                // .where("isApproved", "==", true) // only approwed ads
                .orderBy("adDate", 'desc') // sort in field adDate, 'desc' reverse table and get items from DB from end
                .startAfter(allAds.length !== 0 ? allAds[allAds.length - 1].adDate : new Date().getTime()) // get ads from last displayed or newest according to field adDate
                .limit(2) // how many items be loaded from DB on one time
                .get()

            query.forEach(doc => {

                // ONLY ads no older than month (month = 86400000 * 30 milisekund))
                //if (doc.data().adDate < (new Date().getTime() - 86400000 * 30)) { return }

                // save  ad in State
                setAllAds(prevState => [...prevState, doc.data()])

                // promoted ad put extra on top, change adDate because Each child in a list should have a unique "key"
                if (doc.data().isPromoted === true) {
                    const item = { ...doc.data() }
                    item.adDate = `1${item.adDate}`
                    setAllAds(prevState => [item, ...prevState])
                }
            })
        } catch (err) { console.log('err get ads', err) }
    }

    // ----------------------- STOP ADS  --------------------------//





    return (
        <section className={style.background}>
            <div className={style.container}>


                {/* MAIN CATEGORY */}
                <div className={style.categories}>
                    <p className={style.title}>Kategorie</p>
                    <div className={style.categories__container}>
                        {mainCategories.map(item => {
                            return (
                                <div key={item.nameDB} className={`${style.categories__itemContainer} ${(mainCategory === item.nameDB) && style.categories__itemContainerActive}`} onClick={() => setMainCategory(item.nameDB)}>
                                    <figure className={style.categories__itemFigure}>
                                        <img className={style.categories__itemImg} src={item.photo} alt="main" />
                                    </figure>
                                    <p className={style.categories__itemDesc}>{item.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>


                {/* DESCRIPTION */}
                <div className={style.description}>
                    <p className={style.description__title}>O co chodzi ... ?</p>
                    <div className={style.description__textContainer}>
                        <p className={style.description__text}><strong>Szukasz samochodu, motocykla, maszyny lub urzadzenia elektronicznego</strong> ale nie wiesz jaki model będzie dla Ciebie odpowiedni? <strong>Testuj różne modele</strong>, zasięgnij opinii właścicieli i <strong>dokonaj świadomego wyboru.</strong></p>
                        <p className={style.description__text}><strong>Masz już samochód lub jakieś urządzenie elektroniczne?</strong> Pokaż innym i przy okazji <strong>możesz zarobić</strong>. Dodaj go do bazy i czekaj na zgłoszenie. Pokażesz swóją własność, opowiesz o niej i dostaniesz za to wcześniej ustaloną kwotę.</p>
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
                        <div className={style.filter__itemContainer}>
                            {/* Filter cars id (name) */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Marka:</p>
                                <select className={style.filter__itemList} onChange={setCarIdChosenChandler}>
                                    {cars.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                </select>
                            </div>

                            {/* Filter cars model */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Model:</p>
                                <select className={style.filter__itemList} onChange={e => setCarModelChosen(e.target.value)}>
                                    {cars.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
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

                            {/* Filter type */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Typ:</p>
                                <select className={style.filter__itemList} onChange={e => setTypeChosen(e.target.value)}>
                                    {type.map(item => <option key={item} value={item}>{item}</option>)}
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
                        ? <div className={style.ads__itemsContainer}>
                            {allAds.map((item) => {
                                return (
                                    <a href={`/home/${item.documentKey}`} key={item.adDate} className={style.ads__item} >

                                        <div className={style.ads__itemContainer}>
                                            <figure className={style.ads__itemFigure}>
                                                <img className={style.ads__itemImg} src={item.imageURL[0] || PhotoEmpty} alt="main" />
                                            </figure>

                                            <div className={style.ads__itemDescContainer}>
                                                <div className={style.ads__itemDescTop}>
                                                    <p className={style.ads__itemText}>{cars.find(i => i.id === item.carIdChosen).name}</p>
                                                    <p className={style.ads__itemText}>{item.carModelChosen}</p>
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
                            })
                            }

                            <button onClick={queryToDB}>następne</button>
                        </div>

                        : <p>brak</p>
                    }



                </div>
            </div>

        </section>
    )
}

export default Home



