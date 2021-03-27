import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { Table, Button, Form, Nav, Dropdown, Pagination } from 'react-bootstrap'

import {
    EditProduct,
    DeleteProduct
} from '../actions';

const GetAll = () => {
    const [data, setData] = React.useState([])
    const [editIndex, setEditIndex] = React.useState(null)
    const [name, setName] = React.useState('')
    const [cate, setCate] = React.useState('')
    const [price, setPrice] = React.useState('')
    const [selectedOption, setSelectedOption] = React.useState("")

    const dispatch = useDispatch();

    React.useEffect(() => {
        Axios.get(`http://localhost:2000/admin/getall`)
            .then(res => (setData(res.data)))
            .catch(err => console.log(err))
    }, [data])

    const deleteHandler = (itemId) => {
        const input = {
            id: itemId
        }
        dispatch(DeleteProduct(input))
        console.log(input)
    }

    const saveHandler = (itemId) => {
        const input = {
            product_id: itemId,
            category_id: cate,
            name,
            price
        }
        dispatch(EditProduct(input))
        setEditIndex(null)
        console.log(input)
    }

    const changeName = (e) => {
        const input = e.target.value
        setName(input)
    }

    const changeCate = (e) => {
        const input = e.target.value
        setCate(input)
    }

    const changePrice = (e) => {
        const input = e.target.value
        setPrice(input)
    }

    const options = [
        'Nama A - Z',
        'Nama Z - A',
        'Harga Tertinggi',
        'Harga Terendah',
    ]

    const handleClickListItem = (index) => {
        const input = options[index]
        setSelectedOption(input)

        if (index === 0) return data.sort((a, b) => a.name.localeCompare(b.name))
        if (index === 1) return data.sort((a, b) => -1 * a.name.localeCompare(b.name))
        if (index === 2) return data.sort((a, b) => b.price - a.price)
        if (index === 3) return data.sort((a, b) => a.price - b.price)
    }

    const itemsPerPage = 10
    const [page, setPage] = React.useState(1)
    const noOfPages = Math.ceil(data.length / itemsPerPage)
    const listItem = Array(noOfPages).fill(1)

    const renderTable = () => {
        return data
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((item, index) => {
                return (
                    index === editIndex
                        ?
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Control style={{ width: '600px', fontSize: '20px' }} onChange={(e) => changeName(e)} value={name} placeholder='input product name' />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <Form.Control style={{ width: '200px', fontSize: '20px' }} onChange={(e) => changeCate(e)} value={cate} placeholder='input category id' />
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Control style={{ width: '200px', fontSize: '20px' }} onChange={(e) => changePrice(e)} value={price} placeholder='input product price' />
                            </td>
                            <td style={{ textAlign: 'center', fontFamily: 'Lobster, cursive' }}>{item.total_stock} pcs</td>
                            <td style={{ textAlign: 'center' }}>
                                <Button variant="outline-success" style={{ marginRight: '5px' }} onClick={() => saveHandler(item.id)}> ✔ </Button>
                                <Button variant="outline-danger" style={{ marginLeft: '5px' }} onClick={() => setEditIndex(null)}> ❌ </Button>
                            </td>
                        </tr>
                        :
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td>{item.name}</td>
                            <td style={{ textAlign: 'center' }}>{item.category}</td>
                            <td style={{ textAlign: 'right' }}>IDR {item.price.toLocaleString()}</td>
                            <td style={{ textAlign: 'center', fontFamily: 'Lobster, cursive' }}>{item.total_stock} pcs</td>
                            <td style={{ textAlign: 'center' }}>
                                <Button variant="warning" style={{ marginRight: '5px' }} onClick={() => setEditIndex(index)}> Edit </Button>
                                <Button variant="danger" style={{ marginLeft: '5px' }} onClick={() => deleteHandler(item.id)}> Delete </Button>
                            </td>
                        </tr>
                )
            })
    }
    return (
        <div style={{ marginTop: "138px" }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Nav variant="tabs" defaultActiveKey="/" style={{ marginLeft: '10px' }}>
                    <Nav.Item>
                        <Nav.Link href="/">General</Nav.Link>
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
                <div style={{ display: 'flex', flexDirection: 'row', width: 350 }}>
                    <h3 style={{ marginRight: 10 }}>Sort By</h3>
                    <Dropdown style={{ marginRight: "4%" }}>
                        <Dropdown.Toggle style={{ backgroundColor: "transparent", fontFamily: "Dosis", color: 'black' }} id="dropdown-basic">
                            {selectedOption ? selectedOption : "Berdasarkan"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {options.map((item, index) => {
                                return (
                                    <Dropdown.Item key={index} onClick={() => handleClickListItem(index)}>{item}</Dropdown.Item>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Button as={Link} to='/newproduct' variant="outline-primary" style={{ marginRight: '20px' }}><i class="fas fa-plus-circle"></i> New Product</Button>
            </div>
            <Table striped bordered hover variant="dark">
                <thead style={{ backgroundColor: '#2f3640', textAlign: 'center' }}>
                    <tr style={{ fontFamily: 'Roboto, sans-serif' }}>
                        <th>No</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Total Stock</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{renderTable()}</tbody>
            </Table>
            <div>
                <Pagination>
                    <Pagination.Prev disabled={page <= 1 ? true : false} onClick={() => setPage(page - 1)} />
                    {listItem.map((item, index) => {
                        return (
                            <Pagination.Item key={index} active={index + 1 === page} onClick={() => setPage(index + 1)}>{index + 1}</Pagination.Item>
                        )
                    })}
                    <Pagination.Next disabled={page >= noOfPages ? true : false} onClick={() => setPage(page + 1)} />
                </Pagination>
            </div>
        </div>
    )
}

export default GetAll