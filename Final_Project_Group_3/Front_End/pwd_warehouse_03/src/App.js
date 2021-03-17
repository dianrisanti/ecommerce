import React from 'react'

import { Switch, Route } from 'react-router-dom'

import { useDispatch } from 'react-redux'

import { getProduct } from './actions'

// import pages
import Home from './pages/home'
import Product from './pages/products'

const App = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getProduct())
  }, [])

  return (
    <div>
      <Switch>
        <Route path="/" component={Home} exact/>
        <Route path="/product" component={Product}/>
      </Switch>
    </div>
  )
}

export default App