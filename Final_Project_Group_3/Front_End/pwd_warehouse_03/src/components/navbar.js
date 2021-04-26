import React from 'react'
import {
    Navbar,
    Nav,
    NavLink,
    Dropdown,
    Image,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { Logo } from '../assets'

import { useSelector, useDispatch } from 'react-redux'

import { logout } from "../actions"

function Navigation() {
    const { username } = useSelector((state) => {
        return {
            username: state.user.username
        }
    })

    const dispatch = useDispatch()
    const logoutHandler = () => {
        dispatch(logout())
    }


    return (
        <Navbar fixed='top' style={styles.navbar} expand="lg">
            <Navbar>
                <Navbar.Brand as={Link} to='/'>
                    <Image
                        alt="Electronic-Shop"
                        src={Logo.default}
                        width="100px"
                        height="50px"
                        fluid
                    />
                </Navbar.Brand>
            <p style={{fontFamily:'Sriracha, cursive', fontSize:'28px', marginTop:'12px'}}>Electronic Shop</p>
            </Navbar>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavLink as={Link} to='/' style={{ color: 'black' }}>
                        <i className="fas fa-home" syle={{ marginRight: '10px' }}></i>
                        <strong> HOME</strong>
                    </NavLink>
                </Nav>
                <div style={{display: "flex", width: "16%", justifyContent: "space-between"}}>
                    <Link to='/cart' style={{ fontSize: '23px', marginRight: '10px', marginBottom: '10px', textDecoration: 'none' }}> 
                        <i className="fad fa-shopping-cart" style={{color: 'black'}}></i>
                    </Link>
                    <Dropdown>
                        <Dropdown.Toggle style={{backgroundColor: "#2a9d8f", fontFamily: "Dosis", color: '#081c15'}} id="dropdown-basic">
                            {username ? <i className="far fa-smile" style={{color: '#081c15', fontWeight: '500'}}> {username} </i> : <i className="fas fa-user"> LOG IN</i>}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {username
                                ?
                                <>
                                    <Dropdown.Item as={Link} to ='/login' onClick={logoutHandler}>Log out</Dropdown.Item>
                                    <Dropdown.Item as={Link} to='/profile'>Profile</Dropdown.Item>
                                    <Dropdown.Item as={Link} to='/history'>History</Dropdown.Item>
                                </>
                                :
                                <>
                                    <Dropdown.Item as={Link} to='/login' >Login</Dropdown.Item>
                                    <Dropdown.Item as={Link} to='/register'>Sign Up</Dropdown.Item>
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Navbar.Collapse >
        </Navbar >
    )
}

const styles = {
    navbar: {
        height: "6rem",
        backgroundColor: "#83c5be",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 20px",
        opacity: '0.9'
    }
}

export default Navigation