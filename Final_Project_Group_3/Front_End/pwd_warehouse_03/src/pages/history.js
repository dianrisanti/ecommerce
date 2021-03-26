import React from 'react'
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {
    Accordion,
    Card,
    Table,
    Image,
    Button
} from 'react-bootstrap'
import { CancelOrder, paymentConf } from '../actions'
import { Link } from 'react-router-dom'

const HistoryPage = () => {
    const [data, setData] = React.useState([])
    const { id } = useSelector((state) => {
        return {
            id: state.user.id_user,
        }
    })
    const dispatch = useDispatch()


    React.useEffect(() => {
        async function fetchData() {
            try {
                const res = await Axios.get(`http://localhost:2000/cart/history/${parseInt(id)}`)
                setData(res.data)
            }
            catch(err) {
                console.log(err)
            }

        }
        fetchData()
    }, [id])

    function handlePaymentCon(e) {
        console.log(e)
        dispatch(paymentConf(e))
    }

    const cancelOrder = (e) => {
        dispatch(CancelOrder(e))
        console.log(e)
    }

    const renderTbody = () => {
        return (
            <Accordion>
                {data.map((item, index) => {
                    return (
                        <Card key={index}>
                            <Card.Header>
                                <Accordion.Toggle as={Card.Header} variant="link" eventKey={index + 1} style={{ backgroundColor: "#cbc0d3" }}>
                                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>{index + 1}</span>
                                        <span><p onClick={(e) => { handlePaymentCon(e) }}>Invoice: {item.order_number}</p></span>
                                        <span>Date: {item.date}</span>
                                        <span>Payment Method: {item.payment_method}</span>
                                        <span>Status: {item.status}</span>
                                        <span>Press for Detail <i className="fas fa-caret-square-down"></i></span>
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
                                <div>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Name</th>
                                                <th>Image</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                                {
                                                    item.status === "On Delivery" || item.status === "Arrived"
                                                    ?
                                                    <th>Kirim Dari</th>
                                                    :
                                                    <></>
                                                }
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
                                                        {
                                                            item.status === "On Delivery" || item.status === "Arrived"
                                                            ?
                                                            <td>{item2.delivery_loc.join(", ")}</td>
                                                            :
                                                            <></>
                                                        }
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom:'15px', marginRight:'15px'}}>
                                        <Button variant='danger' onClick={() => cancelOrder(item.order_number)}>Cancel Order</Button>
                                    </div>
                                </div>
                            </Accordion.Collapse>
                        </Card>
                    )
                })}
            </Accordion>
        )
    }

    return (
        <div style={{ marginTop: "150px", padding: "0 20px" }}>
            <h1>Order History</h1>
            <Table striped bordered hover style={{ textAlign: "center" }}>
                {renderTbody()}
            </Table>
        </div>
    )
}

export default HistoryPage