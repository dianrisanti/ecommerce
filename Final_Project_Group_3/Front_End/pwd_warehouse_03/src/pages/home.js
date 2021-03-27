import React from 'react'

// import component
import Carousel from '../components/carousel'
// import Header from '../components/header'
import Product from '../components/products'

const Home = () => {
    return(
        <div style={{marginTop: '110px'}}>
            <Carousel/>
            {/* <Header/> */}
            <Product/>
        </div>
    )
}

export default Home
