import React from 'react'
import {
    Navbar,
    Nav,
    Dropdown,
    DropdownButton,
    Image
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { Logo } from '../assets'

import { useSelector, useDispatch } from 'react-redux'

//NOTE import action log out
import { logout } from "../actions"

function NavigationAdmin() {
    const { username, role } = useSelector((state) => {
        return {
            username: state.user.username,
            role: state.user.role
        }
    })



    const dispatch = useDispatch()
    const logoutHandler = () => {
        dispatch(logout())
    }


    return (
        <Navbar collapseOnSelect fixed='top' style={styles.navbar} expand="lg">
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
                <p style={{ fontFamily: 'Sriracha, cursive', fontSize: '28px', marginTop: '12px' }}>ES - Admin</p>
            </Navbar>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" style={{marginLeft:'50px'}}>
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to='/get_category'>
                        <strong> Category List</strong>
                    </Nav.Link>
                    <Nav.Link as={Link} to='/warehouse_stock'>
                        <strong> Warehouse Stock</strong>
                    </Nav.Link>
                    <Nav.Link as={Link} to='/order_listing'>
                        <strong> Order Listing</strong>
                    </Nav.Link>
                    <Nav.Link as={Link} to='/sales_report'>
                        <strong> Sales Report</strong>
                    </Nav.Link>
                </Nav>

                <Dropdown>
                    <DropdownButton title={username}
                        variant='primary' id="dropdown-button-drop-left" >
                        <Dropdown.Item as={Link} to='/login' onClick={logoutHandler}>Log out</Dropdown.Item>
                    </DropdownButton>
                </Dropdown>
            </Navbar.Collapse >
        </Navbar >
    )
}

const styles = {
    navbar: {
        height: "6rem",
        backgroundColor: "#118ab2",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 20px"
    }
}

export default NavigationAdmin