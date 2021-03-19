import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { 
    Carousel,
    Button,
    Modal,
    Alert,
    Form
} from 'react-bootstrap'
import { useSelector } from 'react-redux'

const ProductDetail = (props) => {
    const input = props.location.search
    const id = parseInt(input.slice(4, input.length))
    // console.log(id)

    const { products } = useSelector((state) => {
        return{
            products: state.product.products
        }
    })
    
    const selected = products.filter(item => item.id === id)
    const product = selected[0]
    // console.log(product.description)

    const [qty, setQty] = React.useState(0)
    const [cartErr, setCartErr] = React.useState(false)
    const [cartSuccess, setCartSuccess] = React.useState(false)
    const [qtyErr, setQtyErr] = React.useState([false, ""])

    const { idUser } = useSelector((state) => {
        return {
            idUser: state.user.id_user
        }
    })

    const addToCartHandler = () => {
        if(qty <= 0) return setQtyErr([true, "Minimal pembelian produk ini adalah 1 barang"])
        const addToCart = {
            order_number: Date.now(),
            id_user: idUser,
            id_product: product.id,
            qty,
            total: qty * product.price
        }
        console.log(addToCart)
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

    return(
        <div style={styles.container}>
            <Alert show={cartSuccess} variant="success" onClose={() => setCartSuccess(false)} dismissible>
                Berhasil menambahkan {product.name} ke
                <Alert.Link as={Link} to='./cart'> keranjang belanjamu!</Alert.Link>
            </Alert>
        
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
                    <p style={{fontSize: "30px"}}>Harga: IDR {product.price.toLocaleString()}</p>
                    <p style={{fontSize: "20px"}}>Stok: {product.total_stock}</p>
                    <div style={styles.qty}>
                        <div>
                             <p style={{fontSize: "20px"}}>Jumlah: </p>
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
                        <p style={{fontSize: "20px"}}>Kategori: {product.category}</p>
                        <p style={{fontSize: "15px"}}>Deskripsi: {product.description}</p>
                    </div>
                    <Button style={styles.checkout} onClick={addToCartHandler}>
                        <i className="fas fa-plus"></i> Keranjang
                    </Button>
                </div>

                <Modal show={cartErr} onHide={() => setCartErr(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Error⚠</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Kuantitas belum sesuai!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCartErr(false)}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

const styles = {
    container: {
        marginTop: "100px", 
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