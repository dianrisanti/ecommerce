import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import React from 'react';
import Axios from 'axios'
import {
    Button,
    Modal
} from 'react-bootstrap'

import { upload, getProduct } from '../actions'

import NO_DATA from '../assets/no_data.png'

const URL_IMG = 'http://localhost:2000/'

function PaymentConfirmation() {
    let [image, setImage] = React.useState('')
    let [paymentCon, setPaymentCon] = React.useState(null)
    let [data, setData] = React.useState([])
    let [refresh, setRefresh] = React.useState(0)
    const [modal, setModal] = React.useState(false)
    const [noPicModal, setNoPicModal] = React.useState(false)
    const dispatch = useDispatch()
    const { order_number, username } = useSelector((state) => {
        return {
            order_number: state.user.order_number,
            username: state.user.username
        }
    })
    let [orderNum, setOrderNum] = React.useState(order_number)
    console.log(orderNum)


    // NOTE getConfirmationPayment
    React.useEffect(() => {
        async function fetchData() {
            try {
                let res = await Axios.get(`http://localhost:2000/user/getpayment/${orderNum}`)
                console.log(res.data[0].payment_confirmation)
                setPaymentCon(res.data[0].payment_confirmation)
                setData(res.data[0])
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [refresh])

    function handleChoose(e) {
        setImage(e.target.files[0])
    }

    function handleUpload() {
        if(!image) return setNoPicModal(true)

        async function fetchData() {
            try {
                let useRefresh = refresh
                const pict = new FormData()
                console.log(pict)
                pict.append('IMG', image)
                console.log(pict.get('IMG'))
                let res = await dispatch(upload(pict, orderNum))
                await Axios.post('http://localhost:2000/cart/booked_stock', {order_number})

                dispatch(getProduct())
                setRefresh(refresh + 1)
                console.log("refresh request executed =", useRefresh, "times")
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
        setModal(true)
    }

    console.log(data)
    if (!orderNum) return <Redirect to='/history' />
    return (
        <div style={styles.profileContainer}>
            <div style={styles.profileBox}>
                <Modal show={modal} onHide={() => setModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Hi, {username}! </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Thank you for uploading your payment slip</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModal(false)}>
                            Close
                        </Button>
                        <Button as={Link} to='/' variant="primary"> 
                            Go to HOME 
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={noPicModal} onHide={() => setNoPicModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Hi, {username}! </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Sorry, you haven't uploaded your payment slip</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setNoPicModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div style={{display: 'flex', flexDirection: 'row', alignItems: "center"}}>
                <h2 style={{ color: !paymentCon ? "black" : "#264653", marginBottom: "20px", marginTop: "30px" }}>{!paymentCon ? "Please upload your payment slip" : "Thank you for uploading your payment slip"}</h2>
                </div>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundImage: `url(${paymentCon ? URL_IMG + paymentCon : NO_DATA})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                    }}>
                </div>
                <div style={styles.buttonProfile}>
                    <div style={{ marginBottom: "10px", marginTop: "20px" }}>
                        <h5>No Invoice: {data.order_number}</h5>
                        <h5>Purchasing Date: {data.date}</h5>
                        <h5>Order Total: {data.total_IDR}</h5>
                        <h5>Payment Method: Transfer Bank {data.payment_method}</h5>
                    </div>
                    <form encType="multipart/form-data">
                        <input
                            type="file"
                            accept="image/*"
                            name="IMG"
                            onChange={(e) => handleChoose(e)}
                        />
                    </form>
                    <Button
                        className="button"
                        variant="success"
                        onClick={handleUpload}
                        style={{marginTop: 15}}
                        disabled={paymentCon ? true : false}
                    >
                        Upload
                    </Button>
                </div>
                
            </div>
        </div >
    );
}

const styles = {
    profileContainer: {
        marginTop: '5%',
        width: '100%',
        height: '85vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileBox: {
        marginTop: "20px",
        width: '65vw',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2% 2%',
    },
    profileInfo: {
        width: '100%',
        height: '50%',
        marginTop: '2%',
        padding: '3% 5%',
    },
    buttonProfile: {
        marginTop: '3%',
        display: 'flex',
        flexDirection: 'column',
    },
    buttonContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
}

export default PaymentConfirmation