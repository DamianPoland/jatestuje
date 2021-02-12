import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { auth } from '../../shared/fire'

// constans
import { IS_AUTH, USER_ID, USER_NAME, USER_EMAIL, USER_PHOTO } from '../../shared/constans'

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
import Footer from "../../components/Footer/Footer";




const App = () => {


  // ----------------------- START LOGIN --------------------------//
  const [isLogin, setIsLogin] = useState(false)
  useEffect(() => {
    auth.onAuthStateChanged(user => {

      user ? setIsLogin(true) : setIsLogin(false)

      // save in local storage
      if (user) {
        localStorage.setItem(IS_AUTH, JSON.stringify(user))
        localStorage.setItem(USER_ID, user.uid)
        localStorage.setItem(USER_NAME, user.displayName)
        localStorage.setItem(USER_EMAIL, user.email)
        localStorage.setItem(USER_PHOTO, user.photoURL)
        console.log("user: ", user)
        console.log("user.uid: ", user.uid)
        console.log("user.displayName: ", user.displayName)
        console.log("user.email: ", user.email)
        console.log("user.photoUrl: ", user.photoURL)
      } else {
        localStorage.removeItem(IS_AUTH)
        localStorage.removeItem(USER_ID)
        localStorage.removeItem(USER_NAME)
        localStorage.removeItem(USER_EMAIL)
        localStorage.removeItem(USER_PHOTO)
        console.log(' user Sign Out')
      }

      // if (user) {
      //   user.getIdTokenResult()
      //     .then(token => console.log("admin: ", token.claims.admin))
      // }

    })
  }, [])
  // ----------------------- END LOGIN --------------------------//


  // aos
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, [])


  return (
    <BrowserRouter>
      <Nav isLogin={isLogin} />
      <Switch>
        <Route path='/home' exact component={Home} />
        <Route path='/userads/:key' component={UserAds} />
        <Route path='/home/:key' component={Ad} />
        <Route path='/user' render={props => <User {...props} isLogin={isLogin} />} />
        <Route path='/contact' component={Contact} />
        <Route path='/privacy-policy' component={PrivacyPolicy} />
        <Route path='/regulations' component={Regulations} />
        <Redirect to='/home' />
      </Switch>
      <AlertPrivacy />
      <Footer />
    </BrowserRouter >
  );
}

export default App;
