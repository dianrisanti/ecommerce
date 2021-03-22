import { useDispatch, useSelector } from 'react-redux'
import React, { Component } from 'react';
import Axios from 'axios'
import {
    Button,
    InputGroup,
    FormControl
} from 'react-bootstrap'

import { upload } from '../actions'

import NO_DATA from '../assets/no_data.png'

const URL_IMG = 'http://localhost:2000/'

function PaymentConfirmation(data) {
    console.log(data)
    let [image, setImage] = React.useState('')
    let [paymentCon, setPaymentCon] = React.useState(null)
    let [errCon, setErrCon] = React.useState(false)
    let [refresh, setRefresh] = React.useState(0)
    const dispatch = useDispatch()


    // NOTE getConfirmationPayment
    React.useEffect(() => {
        async function fetchData() {
            try {
                let res = await Axios.get(`http://localhost:2000/user/getpayment/${'1616161247836'}`)
                console.log(res.data[0].payment_confirmation)
                setPaymentCon(res.data[0].payment_confirmation)
                setErrCon(true)
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
                const order_number = '1616161247836'
                console.log(pict)
                pict.append('IMG', image)
                console.log(pict.get('IMG'))
                let res = await dispatch(upload(pict, order_number))
                setRefresh(refresh+1)
                console.log("refresh request executed =", useRefresh, "times")
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }




    return (
        <div style={styles.profileContainer}>
            <div style={styles.profileBox}>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        // backgroundColor: 'blue',
                        backgroundImage: `url(${errCon ? URL_IMG + paymentCon : NO_DATA})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                    }}>
                </div>
                <div style={styles.buttonProfile}>
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
        height: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'violet'
    },
    profileBox: {
        width: '30vw',
        height: '35vh',
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
        display: 'flex',
        flexDirection: 'column',
        // backgroundColor: 'turquoise'
    },
    buttonProfile: {
        marginTop: '3%'
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