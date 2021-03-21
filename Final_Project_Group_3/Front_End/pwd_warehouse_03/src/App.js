import React from 'react'
import { Switch, Route } from 'react-router-dom'

// import component
import Navigation from './components/navbar'
import Footer from './components/footer'

// import pages
import Home from './pages/home'
import SignUp from './pages/Sign_Up'
import ForgotPassword from './pages/forgotPassword'
import RequestNewPassword from './pages/requestNewPassword'
import Verify from './pages/verification'
import ProductDetail from './pages/productDetail'
import NotFound from './pages/404_page'
import Login from './pages/login'
import CartPage from './pages/cart'
import Profile from './pages/profile'
import History from './pages/history'
import Checkout from './pages/checkout'

import { useDispatch, useSelector } from 'react-redux'

import { getProduct, getCarousel, keepLogin } from './actions'

function App() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getProduct())
    dispatch(getCarousel())
    dispatch(keepLogin())
  }, [])
  
  return (
        <div>
            <Navigation />
            <Switch>
                <Route path='/' component={Home} exact />
                <Route path='/register' component={SignUp} />
                <Route path='/forgot_password' component={ForgotPassword} />
                <Route path='/requestNewPassword' component={RequestNewPassword} />
                <Route path='/verification' component={Verify} />
                <Route path='/login' component={Login} />
                <Route path='/detail' component={ProductDetail}/>
                <Route path='/cart' component={CartPage}/>
                <Route path='/profile' component={Profile}/>
                <Route path='/history' component={History}/>
                <Route path='/checkout' component={Checkout}/>
                <Route path='*' component={NotFound} />
            </Switch>
            <Footer/>
        </div>
  )
}

export default App