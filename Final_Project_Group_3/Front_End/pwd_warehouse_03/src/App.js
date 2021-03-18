import React from 'react'
import { Switch, Route } from 'react-router-dom'

// import component
import Navigation from './components/navbar'

// import pages
import Home from './pages/home'
import SignUp from './pages/Sign_Up'
import Verify from './pages/verification'
import NotFound from './pages/404_page'
import Login from './pages/login'

import { useDispatch } from 'react-redux'

import { getProduct } from './actions'

// import pages
// import Product from './pages/products'

const App = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getProduct())
  }, [])
  
  return (
        <div>
            <Navigation />
            <Switch>
                <Route path='/' component={Home} exact />
                <Route path='/register' component={SignUp} />
                <Route path='/verification' component={Verify} />
                <Route path='/login' component={Login} />
                {/* <Route path="/product" component={Product}/> */}
                <Route path='*' component={NotFound} />
            </Switch>
        </div>
  )
}

export default App