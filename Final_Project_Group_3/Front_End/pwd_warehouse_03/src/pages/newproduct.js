import React from 'react'

import { Button, Form } from 'react-bootstrap'

const NewProduct = () => {

    return (
        <div style={{ width: '100vw', background: 'black' }}>
            <div style={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    marginTop: '80px',
                    height: '500px',
                    width: '900px',
                    background: 'linear-gradient(315deg,#4dff03,#00d0ff)',
                    textAlign: 'center',
                    borderRadius: '5px',
                    boxShadow: '0 5px 15px black',
                    borderTop: '1px solid grey',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{
                        height: '500px',
                        width: '900px',
                        background: 'linear-gradient(315deg,#4dff03,#00d0ff)',
                        textAlign: 'center',
                        borderRadius: '5px',
                        boxShadow: '0 5px 15px black',
                        borderTop: '1px solid grey',
                        filter: 'blur(30px)'
                    }}>
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        right: '6px',
                        bottom: '6px',
                        background: 'rgba(0,0,0,0.6)',
                        zIndex: 2
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '0px',
                            left: '0px',
                            width: '50%',
                            height: '100%',
                            background: 'rgba(225,225,2255,0.1)'
                        }}>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                            <div style={{ flexGrow: '4' }}>
                                <strong style={{ color: 'white', marginTop: '15px', fontSize:'60px', fontFamily:'Roboto, sans-serif' }}>NEW PRODUCT</strong>
                            </div>
                            <div style={{ flexGrow: '6', paddingLeft:'25px', paddingRight:'25px',fontFamily:'Playfair Display, serif' }}>
                                <div style={{ display: 'flex', color:'white', justifyContent:'space-between', marginBottom:'10px' }}>
                                    <h2>Product Name : </h2><Form.Control style={{ width: '500px', fontSize: '20px' }} />
                                </div>
                                <div style={{ display: 'flex', color:'white', justifyContent:'space-between', marginBottom:'10px' }}>
                                    <h2>Image Source : </h2><Form.Control style={{ width: '500px', fontSize: '20px' }} />
                                </div>
                                <div style={{ display : 'flex', color:'white', justifyContent:'space-between', marginBottom:'10px' }}>
                                    <h2>Category ID : </h2><Form.Control style={{ width: '500px', fontSize: '20px' }} />
                                </div>
                                <div style={{ display : 'flex', color:'white', justifyContent:'space-between', marginBottom:'10px' }}>
                                    <h2>Product Price : </h2><Form.Control style={{ width: '500px', fontSize: '20px' }} />
                                </div>
                                <div style={{ display : 'flex', color:'white', justifyContent:'space-between', marginBottom:'10px' }}>
                                    <h2>Product Description : </h2><Form.Control style={{ width: '500px', fontSize: '20px' }} />
                                </div>
                            </div>
                            <div style={{ flexGrow: '2' }}>
                                <Button variant='outline-light' style={{fontSize:'22px', marginBottom:'10px', width:'100px', fontFamily:'Lobster, cursive'}}>Add</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewProduct