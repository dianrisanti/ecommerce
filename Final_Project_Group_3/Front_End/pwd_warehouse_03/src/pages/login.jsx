// import Axios from 'axios' // NOTE ga pake axios lagi karna udah ada keep login
import React, { useState, useRef } from 'react'
// import Axios from 'axios'
import {
    Button,
    InputGroup,
    FormControl,
    Modal,
} from 'react-bootstrap'

// import action untuk login dan logout
import { login, logout } from '../actions'

// import connect redux
import { connect } from "react-redux"

// import redirect from react router-dom
import { Redirect, Link } from "react-router-dom"

function Login(props) {
    console.log(props)
    let usernameRef = useRef('')
    let passwordRef = useRef('')
    let renderCount = useRef(1)
    console.log(`Login page rendered ${renderCount.current} times`)
    renderCount.current = renderCount.current + 1

    let [visible, setVisible] = useState(false)


    function handleLogin(x) {
        console.log(x)
        let username = `${usernameRef.current.value.includes("@") ? "" : usernameRef.current.value}`
        let email = `${usernameRef.current.value.includes("@") ? usernameRef.current.value : ""}`
        let password = passwordRef.current.value
        console.log(username, email, password)

        const body = {
            username,
            email,
            password
        }
        props.login(body)
    }
    if (props.username) return <Redirect to='/' />
    console.log(usernameRef.current.value)
    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h1 style={{ display: "flex", justifyContent: "center" }}>Login</h1>
                <p>Username</p>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                            <i className="fas fa-user"></i>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        ref={usernameRef}
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <p>Password</p>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend style={{ cursor: 'pointer', width: '40px' }}
                        onClick={() => setVisible(!visible)}>
                        <InputGroup.Text id="basic-addon1">
                            <i className={visible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                            {/* {visible ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>} */}
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        ref={passwordRef}
                        placeholder="password"
                        aria-label="password"
                        type={visible ? "text" : "password"}
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <div style={{ display: "flex", justifyContent: "center", }}>
                    <Button onClick={handleLogin} variant='primary' style={{ marginTop: "10px", }}>Login</Button>
                </div>
                <p style={{ marginTop: "10px" }}>Do you have an account? <Link to='/register'>Register Here</Link></p>
                <p>Forgot password ? <Link to='/requestNewPassword'>Click Here</Link></p>
                <Modal show={Boolean(props.msgError)} onHide={props.logout}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>{props.msgError}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={props.logout}>
                            Okay
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

const styles = {
    container: {
        width: '400px',
        background: 'rgba(82, 192, 192, 0.7)',
        padding: '10px',
        borderRadius: '15px',
        marginTop: '200px',
        height: '400px',
    },
    item: {
        margin: '15px 0'
    },
    background: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        background: "url(https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&q=80) no-repeat center",
        backgroundSize: '100vw 100vh',
        marginTop: '138px'
    }
}


const mapStateToProps = (state) => {
    return {
        username: state.user.username,
        msgError: state.user.errLogin
    }
}

export default connect(mapStateToProps, { login, logout })(Login)