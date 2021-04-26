import React from 'react'
import Axios from 'axios'
import {
    Form,
    Pagination,
    Button,
    Table,
    Image,
    Modal,
    InputGroup,
    FormControl
} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { confirmPayment, getOrder, cancelOrder } from '../actions'

const OrderListing = () => {
    const { data } = useSelector((state) => {
        return {
            data: state.order.orders
        }
    })

    console.log(data)
    const dispatch = useDispatch()

    // NOTE filter harga dan nama
    const [dataUser, setDataUser] = React.useState([]) // NOTE data user
    let [refresh, setRefresh] = React.useState(0)
    let [alert, setAlert] = React.useState(false)
    let [orderNumber, setOrderNumber] = React.useState("")
    let Message = React.useRef('')

    React.useEffect(() => {
        async function fetchData() {
            try {
                let res = await Axios.get(`http://localhost:2000/user/getUser`)
                const users = ["All"]
                res.data.map(item => users.push(item.username))
                setDataUser(users)
                dispatch(getOrder())
            }
            catch (err) {
                console.log(err)
            }

        }
        fetchData()
    }, [refresh])

    const [selectedUser, setSelectedUser] = React.useState("")
    const itemsPerPage = 10
    const [page, setPage] = React.useState(1)
    const noOfPages = selectedUser ? 1 : Math.ceil(data.length / itemsPerPage)
    const listItem = Array(noOfPages).fill(1)

    const handleClickListUser = (e) => {
        const input = e.target.value
        setSelectedUser(input)

        if (input === 'All') return setSelectedUser("")
        setPage(1)
    }

    function handlePaymentCon(orderNum) {
        async function fetchData() {
            try {
                await Axios.post(`http://localhost:2000/cart/delivery_stock`, {order_number: orderNum})
                dispatch(confirmPayment(orderNum))
                let useRefresh = refresh
                setRefresh(refresh + 1)
                console.log("refresh request executed =", useRefresh, "times")
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }

    function handleCancelOrder(orderNum) {
        async function fetchData() {
            try {
                await Axios.post(`http://localhost:2000/cart/cancel_stock`, {order_number: orderNum})
                dispatch(cancelOrder(orderNum))
                setOrderNumber(orderNum)
                let useRefresh = refresh
                setRefresh(refresh + 1)
                setAlert(true)
                console.log("refresh request executed =", useRefresh, "times")
            }
            catch (err) {
                console.log(err)
            }

        }
        fetchData() 
    }

    function handleCancelMessage() {
        let CancelMsg = {message: Message.current.value}


        Axios.post(`http://localhost:2000/admin/cancelOrder/${orderNumber}`, CancelMsg)
            .then((res) => {
                console.log(res.data)
                let useRefresh = refresh
                setRefresh(refresh + 1)
                console.log("refresh request executed =", useRefresh, "times")
                setAlert(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const actionHandler = (status, order_number, paymentConf, msg) => {
        if (status === "Not Paid") {
            return(
                <i style={{ color: "#457b9d" }}>Waiting for payment</i>
            )
        }
        if (status === "Paid") {
            return(
                <div style={{display: 'flex', justifyContent: 'space-between', width: 200}}>
                    <Button style={{fontSize: 11}} onClick={() => handlePaymentCon(order_number)}> Confirm Payment </Button>
                    <Button style={{fontSize: 11}} className="btn btn-danger"  onClick={() => handleCancelOrder(order_number)}> Cancel Order </Button>
                </div>
            )
        }
        if (status === "On Delivery" || status === "Canceled" || status === "Arrived" ) {
            return(
                <i style={{ color: "#457b9d" }}>Completed</i>
            )
        }
    }

    return (
        <div style={{ marginTop: "120px", padding: "0 20px" }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between' , marginBottom: 40, marginLeft: 20, alignItems: 'center' ,width: 350 }}>
                <h5>Filter User</h5>
                <Form.Control 
                    as="select" 
                    value={selectedUser ? selectedUser : ""} 
                    onChange={(e) => handleClickListUser(e)}
                    style={{width: 250}}
                >
                    <option>Choose user ... </option>
                    {
                        dataUser.map((item, index) => {
                            return (<option key={index} value={item}>{item}</option>)
                        })
                    }
                </Form.Control>
            </div>

            <div style={{ marginTop: "20px", padding: "0 20px"}}>
                <div>
                    {selectedUser
                        ?
                        data
                            .filter(item => item.username === selectedUser)
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((item, index) => {
                                return (
                                    <div style={{border: "1px solid", marginTop: 30}}>
                                        <div style={{ display: "flex", marginLeft: 20, height: 100}}>
                                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", borderRightColor: "black" }}>
                                                <p style={{margin: 0}}> <b>User :</b> {item.username}</p>
                                                <p style={{margin: 0}}> <b>Invoice:</b> {item.order_number}</p>
                                                <p style={{margin: 0}}> <b>Date:</b> {item.date}</p>
                                                <p style={{margin: 0}}> <b>Status:</b> {item.status}</p>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 670}}>
                                                <p style={{margin: 0}}> <b>Payment Method: </b> {item.payment_method}</p>
                                                <p style={{margin: 0}}> <b>Total Belanja : </b> {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'IDR' }).format(item.total_belanja)}</p>
                                                <div style={{margin: 0, display: "flex"}}> <b style={{marginRight: 10}}>Action:</b> {actionHandler(item.status, item.order_number, item.payment_confirmation, item.message)}</div>
                                            </div>
                                        </div>
                                        <Table>
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
                                    </div>
                                )
                            })
                        :
                        data
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((item, index) => {
                                return (
                                    <div style={{border: "1px solid", marginTop: 30}}>
                                        <div style={{ display: "flex", marginLeft: 20, height: 100}}>
                                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", borderRight: "1px solid", width: 550}}>
                                                <p style={{margin: 0}}> <b>User :</b> {item.username}</p>
                                                <p style={{margin: 0}}> <b>Invoice:</b> {item.order_number}</p>
                                                <p style={{margin: 0}}> <b>Date:</b> {item.date}</p>
                                                <p style={{margin: 0}}> <b>Status:</b> {item.status}</p>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: 20}}>
                                                <p style={{margin: 0}}> <b>Payment Method: </b> {item.payment_method}</p>
                                                <p style={{margin: 0}}> <b>Total Belanja: </b> {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'IDR' }).format(item.total_belanja)}</p>
                                                <div style={{margin: 0, display: "flex"}}> <b style={{marginRight: 10}}>Action:</b> {actionHandler(item.status, item.order_number, item.payment_confirmation, item.message)}</div>
                                            </div>
                                        </div>
                                        <Table>
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
                                    </div>
                                )
                            })
                    }
                </div>
                <Modal show={alert} onHide={() => setAlert(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Please insert the cancellation reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    <i className="fas fa-comment-dots"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                ref={Message}
                                placeholder="Input the reason for cancellation"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" data-dismiss="modal" onClick={() => handleCancelMessage()}>
                            Okay
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div style={{marginTop: 15}}>
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
        </div >
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