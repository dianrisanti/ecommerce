import React from 'react'
import { Switch, Route } from 'react-router-dom'

// import component
import Navigation from './components/navbar'
import Footer from './components/footer'

// import pages
import Home from './pages/home'
import SignUp from './pages/Sign_Up'
import Verify from './pages/verification'
import ProductDetail from './pages/productDetail'
import NotFound from './pages/404_page'
import Login from './pages/login'

import { useDispatch } from 'react-redux'

import { getProduct, getCarousel } from './actions'

// import actions
import { keepLogin } from './actions'
import { connect } from 'react-redux'


const App = (props) => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getProduct())
    dispatch(getCarousel())
    props.keepLogin()
  }, [props])
  
  return (
        <div>
            <Navigation />
            <Switch>
                <Route path='/' component={Home} exact />
                <Route path='/register' component={SignUp} />
                <Route path='/verification' component={Verify} />
                <Route path='/login' component={Login} />
                <Route path='/detail' component={ProductDetail}/>
                <Route path='*' component={NotFound} />
            </Switch>
            <Footer/>
        </div>
  )
}

export default connect(null, { keepLogin })(App)