import React from 'react'
import Axios from 'axios'
import { Redirect, Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { Table, Button, Form, Modal, Image, Alert } from 'react-bootstrap'

const CartPage = () => {
    const [data, setData] = React.useState([])
    const [checkout, setCheckout] = React.useState(false)
    const { id } = useSelector((state) => {
        return {
            id: state.user.id_user
        }
    })

    React.useEffect(() => {
        Axios.get(`http://localhost:2000/cart/get/${parseInt(id)}`)
            .then(res => (setData(res.data)))
            .catch(err => console.log(err))
    }, [id])

    const renderTable = () => {
        return data.map((item, index) => {
            return (
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
                        <Button style={{ marginRight: '5px' }}> Edit </Button>
                        <Button variant="danger" style={{ marginLeft: '5px' }}> Delete </Button>
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