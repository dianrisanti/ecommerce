import React from 'react'
import Axios from 'axios'
import { Redirect, Link } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { Table, Button, Form, Modal, Image, Alert } from 'react-bootstrap'
import {
    GetCartAction,
    EditCartQtyAction,
    DeleteCartItemAction,
    ChekOutAction,
} from '../actions';

const CartPage = () => {
    const [data, setData] = React.useState([])
    const [checkout, setCheckout] = React.useState(false)
    const [editIndex, setEditIndex] = React.useState(null)
    const [qty, setQty] = React.useState(0)
    const [qtyErr, setQtyErr] = React.useState([false, ""])


    const { id } = useSelector((state) => {
        return {
            id: state.user.id_user
        }
    })

    const { products } = useSelector((state) => {
        return {
            products: state.product.products
        }
    })

    const dispatch = useDispatch();

    React.useEffect(() => {
        Axios.get(`http://localhost:2000/cart/get/${parseInt(id)}`)
            .then(res => (setData(res.data)))
            .catch(err => console.log(err))
    }, [id])

    const deleteHandler = (itemId) => {
        const num = data[0].order_number
        const input = {
            id_product: itemId,
            order_number: num
        }
        dispatch(DeleteCartItemAction(input, id))

    }

    const saveHandler = (itemId) => {
        const num = data[0].order_number
        const input = {
            id_product: itemId,
            order_number: num,
            quantity: qty
            
        }
        dispatch(EditCartQtyAction(input, id))
    }


    const changeQty = (e) => {
        const input = e.target.value

        if (isNaN(+input)) return setQty(0)
        if (+input > products.total_stock) return setQtyErr([true, `Maks. pembelian barang ini ${products.total_stock} item`])

        setQty(+input)
        setQtyErr([false, ""])
    }

    const renderTable = () => {
        return data.map((item, index) => {
            return (
                index === editIndex
                    ?
                    <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td>
                            <Image style={{ width: 60, height: 60, marginRight: "15px" }} src={item.image} rounded />
                            {item.name}
                        </td>
                        <td style={{ textAlign: 'right' }}>{item.price}</td>
                        <td style={{ textAlign: 'center' }}>
                            <button
                                disabled={qty <= 0 ? true : false}
                                onClick={() => setQty(qty - 1)}
                                style={{ height: "2rem", margin: "10px", borderRadius: "30px" }}
                            ><i className="fas fa-minus"></i></button>
                            <Form.Control style={{ width: '90px', fontSize: '20px' }} onChange={(e) => changeQty(e)} value={qty} min={0} />
                            <button
                                disabled={qty >= products.total_stock ? true : false}
                                onClick={() => setQty(qty + 1)}
                                style={{ height: "2rem", margin: "10px", borderRadius: "30px" }}
                            ><i className="fas fa-plus"></i></button>
                        </td>
                        <td style={{ textAlign: 'right' }}>{item.price * qty}</td>
                        <td style={{ textAlign: 'center' }}>
                            <Button style={{ marginRight: '5px' }} onClick={() => saveHandler(item.id_product)}> Save </Button>
                            <Button variant="danger" style={{ marginLeft: '5px' }} onClick={() => setEditIndex(null)}> Cancel </Button>
                        </td>
                    </tr>
                    :
                    <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td>
                            <Image style={{ width: 60, height: 60, marginRight: "15px" }} src={item.image} rounded />
                            {item.name}
                        </td>
                        <td style={{ textAlign: 'right' }}>{item.price}</td>
                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right' }}>{item.total}</td>
                        <td style={{ textAlign: 'center' }}>
                            <Button style={{ marginRight: '5px' }} onClick={() => setEditIndex(index)}> Edit </Button>
                            <Button variant="danger" style={{ marginLeft: '5px' }} onClick={() => deleteHandler(item.id_product)}> Delete </Button>
                        </td>
                    </tr>
            )
        })
    }

    if (!id) return <Redirect to='/' />
    return (
        <div style={{ marginTop: "100px" }}>
            <Alert show={checkout} variant="success" onClose={() => setCheckout(false)} dismissible>
                Berhasil
                <Alert.Link as={Link} to='./checkout'> checkout! </Alert.Link>
            </Alert>

            <Table striped bordered hover variant="dark">
                <thead style={{ backgroundColor: '#2f3640', textAlign: 'center' }}>
                    <tr>
                        <th>No</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{renderTable()}</tbody>
            </Table>
            <Button style={styles.checkout} onClick={() => setCheckout(true)}>
                <i className="fas fa-plus"></i> Checkout
            </Button>
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

export default CartPage