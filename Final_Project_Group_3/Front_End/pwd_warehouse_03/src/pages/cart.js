import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { login } from '../actions'

import { Table, Button, Form, Modal, Image } from 'react-bootstrap'

class CartPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedindex: null,
            newQty: 0,
            reqPayment: false,
            reqPass: false,
            errPass: false,
            errPayment: false,
            cartEmpty: false,
            toHistory: false
        }
    }
    handledelete = (index) => {
        let tempcart = this.props.cart
        tempcart.splice(index, 1)
        Axios.patch(`http://localhost:2000/login/${this.props.id}`, { cart: tempcart })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/login/${this.props.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    handlesave = (index) => {
        let tempProduct = this.props.cart[index]
        tempProduct.quantity = parseInt(this.state.newQty)
        tempProduct.total = this.state.newQty * this.props.cart[index].price
        let tempCart = this.props.cart
        tempCart.splice(index, 1, tempProduct)
        Axios.patch(`http://localhost:2000/login/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/login/${this.props.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                        this.setState({ selectedindex: null })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    handleminus = () => {
        if (this.state.newQty <= 0) return

        this.setState({ newQty: this.state.newQty - 1 })
    }
    changeQty = (e) => {
        this.setState({ newQty: e.target.value })
    }
    totalprice = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.total)  
        return counter
    }
    checkout = () => {
        if (this.props.cart.length === 0) return this.setState({ cartEmpty: true })
        this.setState({ reqPass: true })
    }
    confPayment = () => {
        let nominal = this.refs.payment.value
        let total = this.totalprice()
        if (nominal < total) return this.setState({ errPayment: true })
        let history = {
            username: this.props.username,
            date: new Date().toLocaleString(),
            total: total,
            product: this.props.cart
        }
        console.log(history)
        Axios.post('http://localhost:2000/history', history)
            .then((res) => {
                console.log(res.data)
                Axios.patch(`http://localhost:2000/login/${this.props.id}`, { cart: [] })
                    .then((res) => {
                        console.log(res.data)
                        Axios.get(`http://localhost:2000/login/${this.props.id}`)
                            .then((res) => {
                                console.log(res.data)
                                this.props.login(res.data)
                                this.setState({ reqPayment: false, toHistory: true })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    confPass = () => {
        let pass = this.refs.pass.value
        if (pass !== this.props.pass) return this.setState({ errPass: true })
        this.setState({ reqPayment: true, reqPass: false })
    }
    renderTHead = () => {
        return (
            <thead style={{ backgroundColor: '#2f3640', textAlign: 'center' }}>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }
    renderTBody = () => {
        return (
            <tbody>
                {this.props.cart.map((item, index) => {
                    if (this.state.selectedindex === index) {
                        return (
                            <tr>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <Image style={{ width: 60, height: 60 }} src={item.image} rounded />
                                </td>
                                <td style={{ textAlign: 'center' }}>{item.size}</td>
                                <td style={{ textAlign: 'right' }}>IDR {item.price.toLocaleString()}</td>
                                <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button variant="outline-primary" onClick={this.handleminus}>
                                            ➖
                                        </Button>
                                        <Form.Control style={{ width: '100px' }} onChange={(e) => this.changeQty(e)} value={this.state.newQty} min={0} />
                                        <Button variant="outline-primary" onClick={() => this.setState({ newQty: parseInt(this.state.newQty) + 1 })}>
                                            ➕
                                        </Button>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>IDR {(this.state.newQty * item.price).toLocaleString()}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <Button style={{ marginRight: '10px' }} variant="outline-success" onClick={() => this.handlesave(index)}>✔</Button>
                                    <Button variant="outline-danger" onClick={() => this.setState({ selectedindex: null })}>❌</Button>
                                </td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td>{item.name}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Image style={{ width: 60, height: 60 }} src={item.image} rounded />
                            </td>
                            <td style={{ textAlign: 'center' }}>{item.size}</td>
                            <td style={{ textAlign: 'right' }}>IDR {item.price.toLocaleString()}</td>
                            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right' }}>IDR {item.total.toLocaleString()}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Button style={{ marginRight: '10px' }} variant="success" onClick={() => this.setState({ selectedindex: index, newQty: item.quantity })}>Edit</Button>
                                <Button variant="danger" onClick={() => this.handledelete(index)}>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }
    render() {
        const { reqPayment, reqPass, errPass, errPayment, cartEmpty, toHistory } = this.state
        if (!this.props.id) return <Redirect to='/login' />
        if (toHistory) return <Redirect to='/history' />
        return (
            <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1 style={{ color: 'white', fontFamily: 'Acme, sans-serif', fontSize: '42px' }}> Your Cart</h1>
                    <Button style={{ height: '50px' }} onClick={this.checkout} variant="outline-info">Checkout</Button>
                </div>
                <Table striped bordered hover variant="dark" style={{ marginTop: '15px' }}>
                    {this.renderTHead()}
                    {this.renderTBody()}
                </Table>
                <h1 style={{ textAlign: 'right', color: 'white' }}>Total: IDR {this.totalprice().toLocaleString()}</h1>
                <Modal show={reqPayment} onHide={() => this.setState({ reqPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref="payment" type="number" placeholder="Tolong Masukan Jumlah Uang Untuk Pembayaran:" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPayment: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPayment} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPayment} onHide={() => this.setState({ errPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Jumlah Uang Kurang Dari Total Cart</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPayment: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={reqPass} onHide={() => this.setState({ reqPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref="pass" type="password" placeholder="Tolong Masukan Password Untuk Melanjutkan Pembayaran:" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPass: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPass} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPass} onHide={() => this.setState({ errPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Wrong Password</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPass: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={cartEmpty} onHide={() => this.setState({ cartEmpty: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Make Sure Your Cart Is Not Empty!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ cartEmpty: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.login.cart,
        id: state.login.id,
        pass: state.login.password,
        username: state.login.username
    }
}
export default connect(mapStateToProps, { login })(CartPage)