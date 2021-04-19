import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { auth } from '../../shared/fire'

// constans
import { UID, ADMIN } from '../../shared/constans'

// data
import { mainCategories } from '../../shared/data'

// aos
import AOS from 'aos'
import 'aos/dist/aos.css'

// components
import Nav from "../../components/Nav/Nav";
import Home from "../../components/Home/Home";
import User from "../../components/User/User";
import Ad from "../../components/Ad/Ad";
import UserAds from "../../components/UserAds/UserAds";
import Contact from '../../components/Contact/Contact'
import PrivacyPolicy from '../../components/PrivacyPolicy/PrivacyPolicy'
import Regulations from '../../components/Regulations/Regulations'
import AlertPrivacy from '../../UI/AlertPrivacy/AlertPrivacy'
import Footer from "../../components/Footer/Footer"




const App = () => {

  // aos init
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, [])


  // ----------------------- START LOGIN --------------------------//

  const [isLogin, setIsLogin] = useState(false)
  useEffect(() => {
    auth.onAuthStateChanged(user => {

      // save in state
      user ? setIsLogin(true) : setIsLogin(false)

      // save in local storage
      user ? localStorage.setItem(UID, user.uid) : localStorage.removeItem(UID)

      // save in local storage isAdmin - ONLY for see archiwum ads in Home and UseAds
      !user && localStorage.removeItem(ADMIN)
      user?.getIdTokenResult()
        .then(token => token.claims.admin ? localStorage.setItem(ADMIN, token.claims.admin) : localStorage.removeItem(ADMIN))
    })
  }, [])

  // ----------------------- END LOGIN --------------------------//




  // ----------------------- START HOME STATES --------------------------//

  // Next Button
  const [isNextButtonShow, setIsNextButtonShow] = useState(true)

  // STATE - set ALL ADS
  const [allAds, setAllAds] = useState([])

  // STATE - set mainCategory
  const [mainCategory, setMainCategory] = useState(mainCategories[0].nameDB)

  // STATE - set region
  const [regionChosen, setRegionChosen] = useState("")

  // STATE - set city
  const [cityChosen, setCityChosen] = useState("")

  // STATE - set car id (name)
  const [carIdChosen, setCarIdChosen] = useState("")

  // STATE - set car model
  const [carModelChosen, setCarModelChosen] = useState("")

  // STATE - set year from
  const [yearFromChosen, setYearFromChosen] = useState("")

  // STATE - set year to
  const [yearToChosen, setYearToChosen] = useState("")

  // STATE - set type
  const [typeChosen, setTypeChosen] = useState("")

  // ----------------------- END HOME STATES --------------------------//



  // ----------------------- START USER STATES --------------------------//

  // STATE - set user ADS
  const [userAds, setUserAds] = useState([])

  // ----------------------- END USER STATES --------------------------//

  return (
    <BrowserRouter>
      <Nav isLogin={isLogin} />
      <Switch>

        <Route path='/home' render={props => <Home {...props}
          isNextButtonShow={isNextButtonShow} setIsNextButtonShow={setIsNextButtonShow}
          allAds={allAds} setAllAds={setAllAds}
          mainCategory={mainCategory} setMainCategory={setMainCategory}
          regionChosen={regionChosen} setRegionChosen={setRegionChosen}
          cityChosen={cityChosen} setCityChosen={setCityChosen}
          carIdChosen={carIdChosen} setCarIdChosen={setCarIdChosen}
          carModelChosen={carModelChosen} setCarModelChosen={setCarModelChosen}
          yearFromChosen={yearFromChosen} setYearFromChosen={setYearFromChosen}
          yearToChosen={yearToChosen} setYearToChosen={setYearToChosen}
          typeChosen={typeChosen} setTypeChosen={setTypeChosen}
        />} />

        <Route path='/offer/:key' render={props => <Ad {...props} />} />

        <Route path='/userads/:key' component={UserAds} />

        <Route path='/user' render={props => <User {...props}
          userAds={userAds} setUserAds={setUserAds}
        />} />

        <Route path='/contact' component={Contact} />

        <Route path='/privacy-policy' component={PrivacyPolicy} />

        <Route path='/regulations' component={Regulations} />

        <Redirect to='/home' />

      </Switch>
      <AlertPrivacy />
      <Footer />
    </BrowserRouter >
  )
}

export default App;
