import React from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import {
    Image,
    Form,
    Button,
    Modal
} from 'react-bootstrap'

const Checkout = () => {
    const [selected, setSelected] = React.useState("")
    let [confirmEmail, setConfirmEmail] = React.useState([false, ""])
    let [regError, setRegError] = React.useState([false, ""])
    const [data, setData] = React.useState([])
    const { id } = useSelector((state) => {
        return {
            id: state.user.id_user
        }
    })

    console.log('data payment', data)

    React.useEffect(() => {
        Axios.get(`http://localhost:2000/cart/summary/${parseInt(id)}`)
            .then(res => (setData(res.data)))
            .catch(err => console.log(err))
    }, [id])

    const handleChange = e => {
        e.persist()
        console.log(e.target.value)

        setSelected(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        async function fetchData() {

            try {
                let res = await Axios.post(`http://localhost:2000/cart/invoice/${parseInt(id)}`)
                console.log(res)
                setConfirmEmail([true, "Invoice has been sent to your email"])
            }
            catch (err) {
                console.log(err.response.data)
                const errMsg = err.response.data
                setRegError([true, errMsg])
            }
        }
        fetchData()
    }

    return (
        <div style={styles.container}>
            <div>
                <h3>Pilih Metode Pembayaran:</h3>
                <Form.Group controlId={selected}>
                    <div>
                        <Form.Check
                            value="BCA"
                            type="radio"
                            aria-label="radio 1"
                            label={
                                <Image
                                    src="https://1.bp.blogspot.com/-LOG22fyGGOo/WransnAeOlI/AAAAAAAABiA/RnFHp0YAHuIcmzMDZNnHFFz-M2sqUEPFQCKgBGAs/s1600/logo-bca.jpg"
                                    style={{ width: '150px', height: '60px' }}
                                />
                            }
                            onChange={handleChange}
                            checked={selected === "BCA"}
                        />
                        <div style={{ marginLeft: '20px' }}>
                            <p>Bank BCA - 000-000-0000</p>
                            <p style={{ marginTop: '-15px' }}>a.n Electronic Shop</p>
                        </div>
                    </div>

                    <div>
                        <Form.Check
                            value="Mandiri"
                            type="radio"
                            aria-label="radio 2"
                            label={
                                <Image
                                    src="http://1.bp.blogspot.com/-zkv5u5OGPEM/VKOWnIRRKBI/AAAAAAAAA7E/ovxa4ZW3I0o/w1200-h630-p-k-no-nu/Logo%2BBank%2BMandiri.png"
                                    style={{ width: '150px', height: '80px' }}
                                />
                            }
                            onChange={handleChange}
                            checked={selected === "Mandiri"}
                        />
                        <div style={{ marginLeft: '20px' }}>
                            <p>Bank Mandiri - 000-000-0000</p>
                            <p style={{ marginTop: '-15px' }}>a.n Electronic Shop</p>
                        </div>
                    </div>

                    <div>
                        <Form.Check
                            value="BNI"
                            type="radio"
                            aria-label="radio 2"
                            label={
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png"
                                    style={{ width: '150px', height: '50px' }}
                                />
                            }
                            onChange={handleChange}
                            checked={selected === "BNI"}
                        />
                        <div style={{ marginLeft: '20px' }}>
                            <p>Bank BNI - 000-000-0000</p>
                            <p style={{ marginTop: '-15px' }}>a.n Electronic Shop</p>
                        </div>
                    </div>
                </Form.Group>

                <Button variant="primary" type="submit" onClick={handleSubmit} >
                    Place Order
                </Button>
                <Modal show={confirmEmail[0]} onHide={() => setConfirmEmail([false, ""])}>
                    <Modal.Header closeButton>
                        <Modal.Title>Checkout Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{confirmEmail[1]}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setConfirmEmail([false, ""])}>
                            Okay
                            </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={regError[0]} onHide={() => setRegError([false, ""])}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{regError[1]}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setRegError([false, ""])}>
                            Okay
                            </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {
                data.length !== 0
                    ?
                    <div style={{ width: '20vw' }}>
                        <h4>Order Summary</h4>
                        <p style={{ fontSize: '20', fontWeight: 'bold' }}>Shipping</p>
                        <p style={{ marginTop: '-10px' }}>{data[0].address}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5>Order Total: </h5>
                            <p>IDR {data[0].total.toLocaleString()}</p>
                        </div>
                    </div>
                    :
                    <div></div>

            }
        </div>
    )
}

const styles = {
    container: {
        marginTop: '138px',
        marginLeft: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        width: '90vw'
    }
}
export default Checkout