import React, { useEffect, useState } from 'react'
import style from './Home.module.css'
import { firestore } from '../../shared/fire'

// data
import { mainCategories, yearsProdBasic, yearsWithEmptyEl, regions, cities } from '../../shared/data'

//component
import ListItemAd from '../ListItemAd/ListItemAd'
import { ReactComponent as NoData } from '../../assets/void.svg'
import AlertSmall from "../../UI/AlertSmall/AlertSmall"
import Spinner from '../../UI/Spinner/Spinner'



const Home = ({ isNextButtonShow, setIsNextButtonShow, allAds, setAllAds, mainCategory, setMainCategory, regionChosen, setRegionChosen, cityChosen, setCityChosen, carIdChosen, setCarIdChosen, carModelChosen, setCarModelChosen, yearFromChosen, setYearFromChosen, yearToChosen, setYearToChosen, typeChosen, setTypeChosen }) => {


    // show or hide small alert
    const [isAlertSmallShow, setIsAlertSmallShow] = useState(false)

    // Spinner
    const [isMainSpinnerShow, setIsMainSpinnerShow] = useState(false)




    // ----------------------- START CATEGORIES --------------------------//

    // call when click new category
    const mainCategoryHandler = (nameDB) => {

        // reset array
        setAllAds([])

        //set new category
        setMainCategory(nameDB)

        //clear all filters
        //setRegionChosen("") // no need to be cleared because in all categories is the same
        //setCityChosen("") // no need to be cleared because in all categories is the same
        setCarIdChosen("")
        setCarModelChosen("")
        setYearFromChosen("")
        setYearToChosen("")
        setTypeChosen("")
        setTypeChosen("")

        // show next button when no more ads
        setIsNextButtonShow(true)
    }

    // ----------------------- STOP CATEGORIES --------------------------//


    // ----------------------- START FILTERS --------------------------//


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


    // load ads from DB first time
    useEffect(() => {
        // start query if allAds is empty
        allAds.length === 0 && queryToDB(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainCategory])


    // query to DB for items
    const queryToDB = async (firstLoad) => {

        // limit ads on one load
        const limitLoadAds = 5

        // production years - get range of years, can't be more than 10 items in array because firebase can't handle that
        let prodYears = yearsProdBasic
        if (yearFromChosen > yearToChosen && yearToChosen) {
            setIsAlertSmallShow({ alertIcon: 'error', description: 'Zły przedział.', animationTime: '2', borderColor: 'red' })
            return
        }
        yearFromChosen && (prodYears = prodYears.filter(i => i >= yearFromChosen))
        yearToChosen && (prodYears = prodYears.filter(i => i <= yearToChosen))

        // show main spinner
        setIsMainSpinnerShow(true)

        // clear ads list if first load or filter
        firstLoad && setAllAds([])

        //set query constructor
        let queryConstructor = firestore.collection(mainCategory)

        // filters for car category only
        carIdChosen && (queryConstructor = queryConstructor.where("itemData.carIdChosen", "==", `${carIdChosen}`))
        carModelChosen && (queryConstructor = queryConstructor.where("itemData.carModelChosen", "==", `${carModelChosen}`))

        // filters use for all categories
        regionChosen && !cityChosen && (queryConstructor = queryConstructor.where("userData.regionChosen", "==", `${regionChosen}`)) // region if city is empty
        cityChosen && (queryConstructor = queryConstructor.where("userData.cityChosen", "==", cityChosen)) // only city - no region
        typeChosen && (queryConstructor = queryConstructor.where("itemData.typeChosen", "==", `${typeChosen}`))

        // main filters added always
        queryConstructor = queryConstructor.where("itemData.yearChosen", "in", prodYears) // production years array - not more then 10 items
        queryConstructor = queryConstructor.where("adData.isApproved", "==", true) // only approwed ads
        queryConstructor = queryConstructor.orderBy("adData.createDate", 'desc') // sort in field createDate, 'desc' - get from the newest to oldest
        queryConstructor = queryConstructor.startAfter(firstLoad ? (new Date().getTime()) : allAds[allAds.length - 1]?.adData.createDate) // get ads from newest or last displayed
        queryConstructor = queryConstructor.limit(limitLoadAds) // how many items be loaded from DB on one time

        // show next button when no more ads
        setIsNextButtonShow(true)

        // ads count for button next to load ads
        let adsCount = 0


        try {
            const query = await queryConstructor.get()

            query.forEach(doc => {

                // show ONLY ads valid, not older than today and tyrn off button
                if (doc.data().adData.timeValidationDate <= (new Date().getTime())) {

                    // TODO turn off button nastęne

                    return
                }

                // increse ads count in this query
                adsCount += 1

                // add new ads to State
                setAllAds(prevState => [...prevState, doc.data()])

                // promoted ad put extra on top, change id because Each child in a list should have a unique "key", in list key = id + createDate
                if (doc.data().adData.isPromoted === true) {
                    const item = { ...doc.data() }
                    item.adData.createDate = `${item.adData.createDate}1` // add only space because can't change url in browser to ad
                    setAllAds(prevState => [item, ...prevState])
                }
            })
        } catch (err) {

            // show alert Error
            setIsAlertSmallShow({ alertIcon: 'error', description: 'Błąd wczytywania. Spróbuj ponownie później.', animationTime: '2', borderColor: 'red' })
            console.log('err get ads', err)
        } finally {

            // hide main spinner
            setIsMainSpinnerShow(false)

            // hide next button when no more ads
            adsCount < limitLoadAds && setIsNextButtonShow(false)

        }
    }

    // ----------------------- STOP ADS  --------------------------//



    return (
        <section className={style.background}>

            {/* AlertSmall */}
            {isAlertSmallShow && <AlertSmall alertIcon={isAlertSmallShow.alertIcon} description={isAlertSmallShow.description} animationTime={isAlertSmallShow.animationTime} borderColor={isAlertSmallShow.borderColor} hide={() => setIsAlertSmallShow(false)} />}
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
                                <select className={style.filter__itemList} onChange={setRegionChosenChandler} value={regionChosen}>
                                    {regions.map(item => <option key={item} value={item}> {item} </option>)}
                                </select>
                            </div>
                            {/* Filter city */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Miasto:</p>
                                <select disabled={!regionChosen} className={style.filter__itemList} onChange={e => setCityChosen(e.target.value)} value={cityChosen}>
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
                                        <select className={style.filter__itemList} onChange={setCarIdChosenChandler} value={carIdChosen}>
                                            {mainCategories[0].brand.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                    </div>

                                    {/* Filter cars model */}
                                    <div className={style.filter__itemContainerSmall}>
                                        <p className={style.filter__itemDesc}>Model:</p>
                                        <select disabled={!carIdChosen} className={style.filter__itemList} onChange={e => setCarModelChosen(e.target.value)} value={carModelChosen}>
                                            {mainCategories[0].brand.find(item => item.id === carIdChosen).models.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>

                                </div>
                            }

                            {/* Filter type */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Typ:</p>
                                <select className={style.filter__itemList} onChange={e => setTypeChosen(e.target.value)} value={typeChosen}>
                                    {mainCategories.find(i => mainCategory === i.nameDB).type.map(item => <option key={item} value={item}>{item}</option>)}
                                </select>
                            </div>

                            {/* Filter year */}
                            <div className={style.filter__itemContainerSmall}>
                                <p className={style.filter__itemDesc}>Rok produkcji:</p>
                                <div className={style.filter__itemContainerItems}>
                                    <select className={style.filter__itemList} onChange={e => setYearFromChosen(e.target.value)} value={yearFromChosen}>
                                        {yearsWithEmptyEl.map(item => <option key={item} value={item}>{item !== "" ? item !== "0" ? item : "pozostałe" : "od"}</option>)}
                                    </select>
                                    <select className={style.filter__itemList} onChange={e => setYearToChosen(e.target.value)} value={yearToChosen}>
                                        {yearsWithEmptyEl.map(item => <option key={item} value={item}>{item !== "" ? item !== "0" ? item : "pozostałe" : "do"}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={style.btnContainer}>
                            <button className={style.btn} onClick={() => queryToDB(true)}>Filtruj</button>
                        </div>
                    </div>
                </div>


                {/* ALL ADS */}
                <div className={style.ads}>
                    {isMainSpinnerShow && <Spinner />}
                    <p className={style.title}>Ogłoszenia</p>

                    {allAds.length !== 0
                        ? <div>
                            {allAds.map((item) => {
                                return (
                                    <ListItemAd key={`${item.adData.id}${item.adData.createDate}`} item={item} />
                                )
                            })
                            }
                            {isNextButtonShow
                                && <div className={style.btnContainerBottom}>
                                    <button className={style.btn} onClick={() => queryToDB(false)}>Następne</button>
                                </div>}
                        </div>
                        : <div className={`${style.ads__emptyContainer} ${isMainSpinnerShow && style.ads__emptyContainerOpacity}`}>

                            <div className={style.ads__emptySVG}>
                                <NoData />
                            </div>
                            <div className={style.ads__emptyContainerDesc}>
                                <p className={style.ads__emptyDescTop}>Brak ogłoszeń.</p>
                                <p className={style.ads__emptyDescBottom}>Poszerz zakres wyszukiwania lub spróbuj później.</p>
                            </div>

                        </div>
                    }
                </div>
            </div>

        </section >
    )
}

export default Home



