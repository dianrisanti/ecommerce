import React from 'react'
import {
    Navbar,
    Nav,
    NavLink,
    Dropdown,
    DropdownButton
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import {
    LOGO
} from '../assets'




function Navigation() {
    return (
        <Navbar fixed='top' style={{ background: 'rgba(82, 192, 192, 0.7)' }} expand="lg">
            <Navbar>
                <Navbar.Brand as={Link} to='/'>
                    <img
                        alt=""
                        src={LOGO.default}
                        width="80"
                        height="50"
                        style={{ borderRadius: '15px', margin: "0px" }}
                    />{' '} <strong>Electronic Shop</strong>
                </Navbar.Brand>
            </Navbar>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavLink as={Link} to='/' style={{ color: 'black' }}>
                        <i className="fas fa-home" syle={{ marginRight: '10px' }}></i>
                        <strong>HOME</strong>
                    </NavLink>
                </Nav>

                <Dropdown>
                    <DropdownButton title='Username' variant='primary'>
                        <Dropdown.Item as={Link} to='/login' >Login</Dropdown.Item>
                        <Dropdown.Item as={Link} to='/sign-up'>Sign Up</Dropdown.Item>
                    </DropdownButton>
                </Dropdown>
            </Navbar.Collapse >
        </Navbar >
    )
}



export default Navigation