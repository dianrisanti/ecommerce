import React from 'react'
import Axios from 'axios'
import {
    Image,
    Button,
    Form,
    FormControl
} from 'react-bootstrap'

const Profile = () => {
    const [profile, setProfile] = React.useState({})
    const [edit, setEdit] = React.useState(false)
    const [input, setInput] = React.useState({
        location: "",
        address: ""
    })

    console.log(input)

    const changeLoc = (e) => {
        const idLoc = e.target.value

        if(+idLoc === 1) return setInput({...input, location: "Jakarta"})
        if(+idLoc === 2) return setInput({...input, location: "Bandung"})
        if(+idLoc === 3) return setInput({...input, location: "Surabaya"})
    }
    
    const changeAddress = (e) => {
        const address = e.target.value

        setInput({...input, address})
    }

    React.useEffect(() => {
        
    }, [])

    return(
        <div style={styles.container}>
            <Image 
                src="https://i.pinimg.com/474x/15/a8/bc/15a8bc7417bb5583b96c24a359fd5dfe.jpg" 
                thumbnail
                style={{width: '200px', height: '200px'}}
            />
            {
                edit
                ?
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '70vw', marginLeft: '25px'}}>
                    <div>
                        <h4>Profile</h4>
                        <p>Username: </p>
                        <p>Email: </p>
                        <p>Kota: 
                            <Form.Control as="select" onChange={(e) => changeLoc(e)}>
                                <option value="1">Jakarta</option>
                                <option value="2">Bandung</option>
                                <option value="3">Surabaya</option>
                            </Form.Control>
                        </p>
                        <p>Alamat: 
                            <FormControl value={input.address} onChange={(e) => changeAddress(e)}/>
                        </p>
                    </div>
                    <div>
                        <Button variant="success" style={{width: '40px', height: '35px', marginRight: '10px'}}><i className="far fa-check-square"></i></Button>
                        <Button variant="danger" style={{width: '40px', height: '35px'}} onClick={() => setEdit(false)}><i className="far fa-window-close"></i></Button>
                    </div>
                </div>
                :
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '70vw', marginLeft: '25px'}}>
                    <div>
                        <h4>Profile</h4>
                        <p>Username: </p>
                        <p>Email: </p>
                        <p>Kota: {input.location} </p>
                        <p>Alamat: {input.address} </p>
                    </div>
                    <Button style={styles.button} onClick={() => setEdit(true)}><i className="fas fa-edit"></i></Button>
                </div>
            }
        </div>
    )
}

const styles = {
    container: {
        display: 'flex', 
        flexDirection: 'row', 
        marginLeft: '60px',
        marginTop: '120px'
    },

    button: {
        width: '38px',
        height: '38px',
        backgroundColor: '#dda15e'
    }
}

export default Profile