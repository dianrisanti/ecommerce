import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import React from 'react';
import Axios from 'axios'
import {
    Button
} from 'react-bootstrap'

import { upload } from '../actions'

import NO_DATA from '../assets/no_data.png'

const URL_IMG = 'http://localhost:2000/'

function PaymentConfirmation() {
    let [image, setImage] = React.useState('')
    let [paymentCon, setPaymentCon] = React.useState(null)
    let [data, setData] = React.useState([])
    let [refresh, setRefresh] = React.useState(0)
    const dispatch = useDispatch()
    const { order_number } = useSelector((state) => {
        return {
            order_number: state.user.order_number,
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
        console.log('e target files', e.target.files)
        setImage(e.target.files[0])
    }

    function handleUpload() {
        async function fetchData() {
            try {
                let useRefresh = refresh
                const pict = new FormData()
                console.log(pict)
                pict.append('IMG', image)
                console.log(pict.get('IMG'))
                let res = await dispatch(upload(pict, orderNum))
                setRefresh(refresh + 1)
                console.log("refresh request executed =", useRefresh, "times")
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }

    console.log(data)
    if (!orderNum) return <Redirect to='/history' />
    return (
        <div style={styles.profileContainer}>
            <div style={styles.profileBox}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: "center"}}>
                <h2 style={{ color: !paymentCon ? "black" : "blue", marginBottom: "20px", marginTop: "30px" }}>{!paymentCon ? "Mohon upload bukti pembayaran" : "Terimakasih telah mengupload bukti pembayaran"}</h2>
                {paymentCon
                    ?
                    <Button as={Link} to='/' style={{ marginLeft: '5px', height: "40px", marginTop: "15px" }}> Go to HOME </Button>
                    :
                    <i style={{ color: "blue" }}>Waiting for approval payment confirmation</i>
                }
                </div>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        // backgroundColor: 'blue',
                        backgroundImage: `url(${paymentCon ? URL_IMG + paymentCon : NO_DATA})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                    }}>
                </div>
                <div style={styles.buttonProfile}>
                    <div style={{ marginBottom: "10px", marginTop: "20px" }}>
                        <h5>No Invoice :{data.order_number}</h5>
                        <h5>Tanggal Pembelian :{data.date}</h5>
                        <h5>Total yang harus dibayarkan :{data.total_IDR}</h5>
                        <h5>Metode Pembayaran : Transfer Bank {data.payment_method}</h5>
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
                    >
                        Upload
                        </Button>
                </div>
                {/* <div style={styles.profileInfo}>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Gender</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            defaultValue={gender ? gender : ''}
                            disabled={!edit}
                            ref="gender"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Kota</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            defaultValue={kota ? kota : ''}
                            disabled={!edit}
                            ref="kota"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Umur</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            aria-describedby="basic-addon1"
                            defaultValue={umur ? umur : ''}
                            disabled={!edit}
                            ref="umur"
                        />
                    </InputGroup>
                </div> */}
            </div>
        </div >
    );
}

const styles = {
    profileContainer: {
        marginTop: '150px',
        width: '100%',
        height: '85vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'violet'
    },
    profileBox: {
        marginTop: "20px",
        width: '65vw',
        height: '85vh',
        // backgroundColor: 'yellowgreen',
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
        // backgroundColor: 'turquoise'
    },
    buttonProfile: {
        marginTop: '3%',
        display: 'flex',
        flexDirection: 'row',
        // alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        /* background-color: pink; */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
}

const mapStateToProps = (state) => {
    return {
        gender: state.user.gender,
        kota: state.user.kota,
        umur: state.user.umur,
        profile_pic: state.user.profile_pic,
        id: state.user.id_users
    }
}

export default PaymentConfirmation