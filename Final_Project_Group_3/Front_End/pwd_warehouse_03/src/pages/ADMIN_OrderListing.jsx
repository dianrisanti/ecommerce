import React from 'react'
import Axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import {
    Card,
    Dropdown,
    Pagination,
    Button,
    Accordion,
    Table,
    Image
} from 'react-bootstrap'
import { useSelector } from 'react-redux'

const OrderListing = () => {
    const { data } = useSelector((state) => {
        return {
            data: state.order.orders
        }
    })

    console.log(data)

    // NOTE filter harga dan nama
    const options = [
        'Nama A - Z',
        'Nama Z - A',
        'Total Belanja Tertinggi',
        'Total Belanja Terendah',
    ]
    const [selectedOption, setSelectedOption] = React.useState("")
    const [data2, setData2] = React.useState([]) // NOTE data total belanja
    const [data3, setData3] = React.useState([]) // NOTE data user

    React.useEffect(() => {
        async function fetchData() {
            try {
                let res2 = await Axios.get(`http://localhost:2000/cart/detail_order`)
                setData2(res2.data)
                try {
                    let res3 = await Axios.get(`http://localhost:2000/user/getUser`)
                    setData3(res3.data)
                }
                catch (err3) {
                    console.log(err3)
                }
            }
            catch (err2) {
                console.log(err2)
            }

        }
        fetchData()
    }, [])

    console.log('data :', data)
    console.log('total belanja :', data2)
    console.log('data user :', data3)


    const handleClickListItem = (index) => {
        const input = options[index]
        setSelectedOption(input)

        if (index === 0) return data2.sort((a, b) => a.username.localeCompare(b.username))
        if (index === 1) return data2.sort((a, b) => -1 * a.username.localeCompare(b.username))
        if (index === 2) return data.sort((a, b) => b.total_belanja - a.total_belanja)
        if (index === 3) return data.sort((a, b) => a.total_belanja - b.total_belanja)
    }

    const [selectedUser, setSelectedUser] = React.useState("")

    const handleClickListItemCate = (index) => {
        const input = data3[index]
        setSelectedUser(input.username)

        if (input.username === 'All') return setSelectedUser("")
    }
    console.log('selectedUser :', selectedUser)

    // pagination
    const itemsPerPage = 3
    const [page, setPage] = React.useState(1)
    const noOfPages = selectedUser ? 1 : Math.ceil(data2.length / itemsPerPage)
    const listItem = Array(noOfPages).fill(1)

    const goToDetail = (index) => {
        console.log(index)
        return <Redirect to={`/detail?id=${index}`} />
    }

    function handlePaymentCon() {

    }

    return (
        <div style={{ marginTop: "150px", padding: "0 20px" }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '40px' }}>
                <h3 style={{ marginRight: 10, marginLeft: 50 }}>Order Listing</h3>
                <div style={{ display: 'flex', flexDirection: 'row', width: 400 }}>
                    <h3 style={{ marginLeft: 10 }}>Filter by User</h3>
                    <Dropdown style={{}}>
                        <Dropdown.Toggle style={{ backgroundColor: "transparent", fontFamily: "Dosis", width: '170px', color: 'black', marginLeft: 10 }} id="dropdown-basic">
                            {selectedUser ? selectedUser : "Berdasarkan"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ height: '200px', overflowY: 'scroll' }}>
                            {data3.map((item, index) => {
                                return (
                                    <Dropdown.Item key={index} onClick={() => handleClickListItemCate(index)}>{item.username}</Dropdown.Item>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div style={{ marginTop: "20px", padding: "0 20px", height: 300 }}>
                <Table striped bordered hover style={{ textAlign: "center"}}>
                    {selectedUser
                        ?
                        // console.log(data.filter(item => item.username === selectedUser.username))
                        data2
                            .filter(item => item.username === selectedUser)
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((item, index) => {
                                return (
                                    <Accordion>
                                        <Card key={index}>
                                            <Card.Header>
                                                <Accordion.Toggle as={Card.Header} variant="link" eventKey={index + 1} style={{ backgroundColor: "#cbc0d3" }}>
                                                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>{index + 1}</span>
                                                        <span>User : {item.username}</span>
                                                        <span><p onClick={(e) => { handlePaymentCon(e) }}>Invoice: {item.order_number}</p></span>
                                                        <span>Date: {item.date}</span>
                                                        <span>Payment Method: {item.payment_method}</span>
                                                        <span>Status: {item.status}</span>
                                                        <span>Total Belanja :
                                                        {
                                                                data
                                                                    .filter(item2 => item2.order_number === item.order_number)
                                                                    .map((item2, index2) => {
                                                                        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'IDR' }).format(item2.total_belanja)
                                                                    })
                                                            }
                                                        </span>
                                                        {item.payment_confirmation === 1
                                                            ?
                                                            <i style={{ color: "blue" }}>Waiting for approval payment confirmation</i>
                                                            :
                                                            <Button as={Link} to='/upload_payment' style={{ marginRight: '5px' }} onClick={() => handlePaymentCon(item.order_number)}> Confirm Payment </Button>
                                                        }
                                                    </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={index + 1}>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>No</th>
                                                            <th>Name</th>
                                                            <th>Image</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.products.map((item2, index2) => {
                                                            return (
                                                                <tr>
                                                                    <td>{index2 + 1}</td>
                                                                    <td>{item2.name}</td>
                                                                    <td>
                                                                        <Image src={item2.image} style={{ height: 100, width: 100 }} rounded />
                                                                    </td>
                                                                    <td>{item2.quantity}</td>
                                                                    <td>IDR {item2.price.toLocaleString()}</td>
                                                                    <td>IDR {item2.total.toLocaleString()}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                )
                            })
                        :
                        data2
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((item, index) => {
                                return (
                                    <Accordion>
                                        <Card key={index}>
                                            <Card.Header>
                                                <Accordion.Toggle as={Card.Header} variant="link" eventKey={index + 1} style={{ backgroundColor: "#cbc0d3" }}>
                                                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>{index + 1}</span>
                                                        <span>User : {item.username}</span>
                                                        <span><p onClick={(e) => { handlePaymentCon(e) }}>Invoice: {item.order_number}</p></span>
                                                        <span>Date: {item.date}</span>
                                                        <span>Payment Method: {item.payment_method}</span>
                                                        <span>Status: {item.status}</span>
                                                        <span>Total Belanja :
                                                        {
                                                                data
                                                                    .filter(item2 => item2.order_number === item.order_number)
                                                                    .map((item2, index2) => {
                                                                        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'IDR' }).format(item2.total_belanja)
                                                                    })
                                                            }
                                                        </span>
                                                        {item.payment_confirmation === 1
                                                            ?
                                                            <i style={{ color: "blue" }}>Waiting for approval payment confirmation</i>
                                                            :
                                                            <Button as={Link} to='/upload_payment' style={{ marginRight: '5px' }} onClick={() => handlePaymentCon(item.order_number)}> Confirm Payment </Button>
                                                        }
                                                    </span>
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={index + 1}>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>No</th>
                                                            <th>Name</th>
                                                            <th>Image</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.products.map((item2, index2) => {
                                                            return (
                                                                <tr>
                                                                    <td>{index2 + 1}</td>
                                                                    <td>{item2.name}</td>
                                                                    <td>
                                                                        <Image src={item2.image} style={{ height: 100, width: 100 }} rounded />
                                                                    </td>
                                                                    <td>{item2.quantity}</td>
                                                                    <td>IDR {item2.price.toLocaleString()}</td>
                                                                    <td>IDR {item2.total.toLocaleString()}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                )
                            })
                    }
                </Table>
            </div>
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

const styles = {
    container: {
        display: "flex",
        flexWrap: "wrap",
        justityContent: "space-between",
    },
    card: {
        width: "16.5rem",
        margin: "10px",
    }
}

export default OrderListing