import React from 'react'

// import component
import Carousel from '../components/carousel'
import Product from '../components/products'

const Home = () => {
    return(
        <div style={{marginTop: '138px'}}>
            <Carousel/>
            <Product/>
        </div>
    )
}

export default Home
