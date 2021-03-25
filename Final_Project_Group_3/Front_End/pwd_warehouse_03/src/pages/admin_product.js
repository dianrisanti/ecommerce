import React from 'react'
import Axios from 'axios'
import { Redirect, Link } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { Table, Button, Form, Image, Nav } from 'react-bootstrap'

const GetAll = () => {
    const [data, setData] = React.useState([])
    const [editIndex, setEditIndex] = React.useState(null)

    const { products } = useSelector((state) => {
        return {
            products: state.product.products
        }
    })

    const dispatch = useDispatch();

    React.useEffect(() => {
        Axios.get(`http://localhost:2000/admin/getall`)
            .then(res => (setData(res.data)))
            .catch(err => console.log(err))
    }, [data])

    const renderTable = () => {
        return data.map((item, index) => {
            return (
                index === editIndex
                    ?
                    <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ textAlign: 'right' }}>
                            <Form.Control style={{ width: '90px', fontSize: '20px' }} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            <Form.Control style={{ width: '90px', fontSize: '20px' }} />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            <Form.Control style={{ width: '90px', fontSize: '20px' }} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            <Form.Control style={{ width: '90px', fontSize: '20px' }} />
                        </td>
                        <td style={{ textAlign: 'center', fontFamily: 'Lobster, cursive' }}>{item.total_stock} pcs</td>
                        <td style={{ textAlign: 'center' }}>
                            <Button variant="outline-success" style={{ marginRight: '5px' }} > ✔ </Button>
                            <Button variant="outline-danger" style={{ marginLeft: '5px' }} onClick={() => setEditIndex(null)}> ❌ </Button>
                        </td>
                    </tr>
                    :
                    <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td>{item.name}</td>
                        <td style={{ textAlign: 'center' }}>
                            <Image style={{ width: 60, height: 60 }} src={item.images} rounded />
                        </td>
                        <td style={{ textAlign: 'center' }}>{item.category}</td>
                        <td style={{ textAlign: 'right' }}>IDR {item.price.toLocaleString()}</td>
                        <td style={{ textAlign: 'center', fontFamily: 'Lobster, cursive' }}>{item.total_stock} pcs</td>
                        <td style={{ textAlign: 'center' }}>
                            <Button variant="warning" style={{ marginRight: '5px' }} onClick={() => setEditIndex(index)}> Edit </Button>
                            <Button variant="danger" style={{ marginLeft: '5px' }} > Delete </Button>
                        </td>
                    </tr>
            )
        })
    }
    return (
        <div style={{ marginTop: "138px" }}>
            <Nav variant="pills" defaultActiveKey="/get_all">
                <Nav.Item>
                    <Nav.Link href="/get_all">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/get_jakarta">Warehouse Jakarta</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/get_medan">Warehouse Medan</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/get_surabaya">Warehouse Surabaya</Nav.Link>
                </Nav.Item>
            </Nav>
            <Table striped bordered hover variant="dark">
                <thead style={{ backgroundColor: '#2f3640', textAlign: 'center' }}>
                    <tr style={{ fontFamily: 'Roboto, sans-serif' }}>
                        <th>No</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Total Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{renderTable()}</tbody>
            </Table>
        </div>
    )
}

export default GetAll