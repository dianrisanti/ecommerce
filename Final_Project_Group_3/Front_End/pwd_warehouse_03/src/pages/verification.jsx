import React, {useEffect} from 'react'
import Axios from 'axios'
import {
    Button
} from 'react-bootstrap'
import {
    Link
} from 'react-router-dom'

import {verification} from '../actions'
import { connect } from 'react-redux'

function Verification (props) {
    useEffect (() => {
        async function fetchData () {

            // NOTE get token from query url
            let token = props.location.search.substring(1)
            
            try {
                let res = await Axios.post('http://localhost:2000/user/verification', {token})
                console.log(res.data)
                props.verification()
            }
            catch(err) {
                console.log(err)
            }
        }
        fetchData()
    },[props])

    console.log(props.status)
    return (
        <div>
            {
            props.status === 1
            ?
            <>
            <h3> Your account has been verified
            <Button as={Link} to='/'>
                Go To Home
            </Button>
            </h3>
            </>
            :
            <h3>'Waiting for account verification'</h3>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        status: state.user.regStatus
    }
}

export default connect(mapStateToProps, { verification })(Verification)