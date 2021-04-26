import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { 
    Carousel,
    Button,
    Modal,
    Form
} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import {getCart} from '../actions'

const ProductDetail = (props) => {
    const input = props.location.search
    const id = parseInt(input.slice(4, input.length))

    const [data, setData] = React.useState([])
    const [qty, setQty] = React.useState(0)
    const [cartSuccess, setCartSuccess] = React.useState(false)
    const [qtyErr, setQtyErr] = React.useState([false, ""])
    const [checkoutError, setCheckError] = React.useState([false, ""])

    const product = data.length === 0 ? [] : data[0]

    const { id_user, username, cart } = useSelector((state) => {
        return{
            id_user: state.user.id_user,
            username: state.user.username,
            cart: state.product.cart
        }
    })

    const dispatch = useDispatch()
    React.useEffect(() => {
        const fetchData = async() => {
            try{
                const res = await Axios.get(`http://localhost:2000/products/detail/${id}`)
                setData(res.data)
                dispatch(getCart(+id_user))
            }
            catch(err){
                console.log(err)
            }
        }
        fetchData()
    }, [])

    const addToCartHandler = () => {
        if(!id_user) return setCheckError([true, "Silahkan login terlebih dahulu"])
        if(qty <= 0) return setQtyErr([true, "Minimal pembelian produk ini adalah 1 barang"])

        const addToCart = {
            order_number: Date.now(),
            id_user,
            id_product: product.id,
            harga: product.price,
            qty,
            total: qty * product.price
        }

        const checkCart = cart.find(i => i.id_product === id)
        console.log('check cart ', checkCart)

        const qtyCart = !checkCart ? 0 : checkCart.quantity
        
        if(qtyCart + qty > product.total_stock) return setQtyErr([true, "Pembelian melebihi stock. Silahkan periksa keranjang belanja Anda"])

        Axios.post('http://localhost:2000/cart/add', addToCart)
            .then(res => {
                console.log(res.data)
                setCartSuccess(true)
                setQtyErr([false, ""])
            })
            .catch(err => console.log(err))
    }

    const changeQty = (e) => {
        const input = e.target.value

        if(isNaN(+input)) return setQty(0)
        if(+input > product.total_stock) return setQtyErr([true, `Maks. pembelian barang ini ${product.total_stock} item`])
        
        setQty(+input)
        setQtyErr([false, ""])
    }

    const handleClose = () => setCartSuccess(false)

    return(
        <div style={styles.container}>

            <Modal show={cartSuccess} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{fontFamily:'Playfair Display, serif'}}>Hi, {username}!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Success add {product.name} to your cart</Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-danger' as={Link} to='./'>
                        Catalogue
                    </Button>
                    <Button variant="outline-success" as={Link} to='./cart'>
                        Cart
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={checkoutError[0]} onHide={() => setCheckError([false, ""])}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{checkoutError[1]}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" as={Link} to='./login'>
                            Login
                        </Button>
                    </Modal.Footer>
            </Modal>
        
            {
                data.length !== 0
                ?
                <div style={styles.content}>
                    <div style={styles.left}>
                        <Carousel>
                            {product.images.map((item, index) => {
                                return (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            src={item}
                                            alt="Slide"
                                        />
                                    </Carousel.Item>
                                )
                            })}  
                        </Carousel>
                    </div>
                    <div style={styles.right}>
                        <h3>{product.name}</h3>
                        <p style={{fontSize: 25}}>Price: IDR {product.price.toLocaleString()}</p>
                        <p style={{fontSize: 20}}>Stock: {product.total_stock}</p>
                        <div style={styles.qty}>
                            <div>
                                <p style={{fontSize: 20}}>Quantity: </p>
                            </div>
                            <div style={{display: "flex", margin: "15px"}}>
                                <button
                                    disabled= {qty <= 0 ? true : false}
                                    onClick={() => setQty(qty - 1)}
                                    style={{height: "2rem", margin: "10px", borderRadius: "30px"}}
                                ><i className="fas fa-minus"></i></button>
                            
                                <Form.Control style={{width: '90px', fontSize: '20px'}} onChange={(e) => changeQty(e)} value={qty} min={0}/>

                                <button
                                    disabled= {qty >= product.total_stock ? true : false}
                                    onClick={() => setQty(qty + 1)}
                                    style={{height: "2rem", margin: "10px", borderRadius: "30px"}}
                                ><i className="fas fa-plus"></i></button>
                            </div>
                        </div>
                        <p style={{fontSize: '14px', color: 'red'}}>{qtyErr[0] ? qtyErr[1] : "" }</p>
                        <div style={styles.description}>
                            <p style={{fontSize: 20}}>Category: {product.category}</p>
                            <p style={{fontSize: "15px"}}>Description: {product.description}</p>
                        </div>
                        <Button style={styles.checkout} onClick={addToCartHandler}>
                            <i className="fas fa-plus"></i> Add to cart
                        </Button>
                    </div>
                </div>
                :
                <div></div>
            }
        </div>
    )
}

const styles = {
    container: {
        marginTop: "108px", 
        padding: "0 20px",
        fontFamily: "PT Serif",
        paddingBottom: '30px'
    },
    content: {
        display: "flex",  
        height: "80vh"
    },
    left: {
        display: "flex", 
        flexBasis: "40%", 
        justifyContent: "center",
        alignItems: "center",
    },
    right: {
        display: "flex",
        flexDirection: "column", 
        flexBasis: "60%",
        justifyContent: "space-between",
        padding: "0 20px" 
    },
    description: {
        fontSize: "13px",
        fontWeight: "350", 
    },
    size: {
        display: "flex",
        justifyContent: "space-between"
    },
    qty: {
        display: "flex",
        width: "30%",
    },
    buttonQty: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    checkout: {
        width: "20%",
        height: "8%",
        backgroundColor: "#118ab2",
        marginLeft: 550    
    }
}

export default ProductDetail