import React from 'react'
import { 
    Image
} from 'react-bootstrap'

const Header = () => {
    return(
        <div>
            <div style={{display: 'flex', width: '88vw' , justifyContent: 'space-between', marginLeft: 83, marginTop: 20}}>
                <Image
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80"
                    style={{width: 350, height: 200}}
                    rounded
                />
                <Image
                    src="https://images.unsplash.com/photo-1528254609158-ae7dfaa48ab3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    style={{width: 350, height: 200}}
                    rounded
                />
                <Image
                    src="https://images.unsplash.com/photo-1525980748402-b2911c326b52?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                    style={{width: 350, height: 200}}
                    rounded
                />
            </div>

        </div>
    )
}

const styles = {
    image: {
        height: "100vh",
        width: "100vw"  
    },
    title: {
        fontSize: "3rem",
        fontWeight: "450",
        opacity: ".8"
    }
}

export default Header