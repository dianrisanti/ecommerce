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
import { CancelOrder, ConfirmArrived, paymentConf } from '../actions'
import { Link } from 'react-router-dom'

const HistoryPage = () => {
    const [data, setData] = React.useState([])
    const [refresh, setRefresh] = React.useState(false)
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
    }, [id, refresh])

    function handlePaymentCon(e) {
        console.log(e)
        dispatch(paymentConf(e))
    }

    const cancelOrder = (e) => {
        dispatch(CancelOrder(e))
        setRefresh(true)
        console.log(e)
    }

    const confirmArrived = (e) => {
        dispatch(ConfirmArrived(e))
        setRefresh(null)
        console.log(e)
    }


    const renderFooter = (status, order_number) => {
        if (status === "Not Paid") {
            return(
                <div style={{display: 'flex', justifyContent: 'space-between', width: 235, marginLeft: 970, marginBottom: 15}}>
                    <Button variant='danger' onClick={() => cancelOrder(order_number)}>Cancel</Button>
                    <Button as={Link} to='/upload_payment' style={{ marginRight: '5px' }} onClick={() => handlePaymentCon(order_number)}> Confirm Payment </Button>
                </div>
            )
        }
        if (status === "Paid") {
            return(
                <div>
                    <p>
                        <i style={{ color: "#457b9d" }}>Waiting for approval payment confirmation</i>
                    </p>
                </div>
            )
        }
        if (status === "On Delivery") {
            return(
                <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: 25, marginBottom: 15}}>
                    <Button variant='success' style={{width: '100px', fontSize: 18}} onClick={() => confirmArrived(order_number)}>Done</Button>
                </div>
            )
        }
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
                                                    <th>Send From</th>
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
                                    {renderFooter(item.status, item.order_number)}
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