import React from 'react'
import Axios from 'axios'
import { Redirect, Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { Table, Button, Form, Modal, Image } from 'react-bootstrap'

const CartPage = () => {
    const [data, setData] = React.useState([])
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
        </div>
    )
}

export default CartPage