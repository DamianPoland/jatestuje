import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { auth } from '../../shared/fire'

// constans
import { IS_AUTH } from '../../shared/constans'

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
        localStorage.setItem(IS_AUTH, user.uid)
        console.log("user: ", user.uid)
      } else {
        localStorage.removeItem(IS_AUTH)
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
