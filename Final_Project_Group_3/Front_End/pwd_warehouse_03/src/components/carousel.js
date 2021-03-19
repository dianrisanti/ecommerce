import React from 'react'
import { 
    Carousel,
    Image 
} from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Slider = () => {
    const { carousel } = useSelector((state) => {
        return{
            carousel: state.product.carousel
        }
    })

    return(
        <div>
            <Carousel>
                {
                    carousel.map((item, index) => {
                        return(
                            <Carousel.Item key={index}>
                                <Image
                                    className="d-block w-100"
                                    src={item.image}
                                    alt="slide"
                                    style={styles.image}
                                    
                                />
                            </Carousel.Item> 
                        )
                    })
                }
            </Carousel>
        </div>
    )
}

const styles = {
    image: {
        height: "100vh",
        width: "100vw"  
    },
    title: {
        fontSize: "3rem",
        fontWeight: "450",
        opacity: ".8"
    }
}

export default Slider