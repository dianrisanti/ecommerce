import React from 'react'
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {
    Table,
    Button,
    Pagination
} from 'react-bootstrap'

const WarehouseStock = () => {
    const [data, setData] = React.useState([])
    console.log('data ', data)

    React.useEffect(() => {
        async function fetchData() {
            try {
                let res = await Axios.get('http://localhost:2000/admin/getstock')
                setData(res.data)
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])
    
    // pagination
    const itemsPerPage = 30
    const [page, setPage] = React.useState(1)
    const noOfPages = Math.ceil(data.length / itemsPerPage)
    const listItem = Array(noOfPages).fill(1)

    const renderTable = () => {
        return(
            <Table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Warehouse Location</th>
                        <th>Booked</th>
                        <th>Must Delivery</th>
                        <th>Total Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((item, index) => {
                            return(
                                <tr>
                                    <td>{item.id_warehouse}</td>
                                    <td>{item.name}</td>
                                    <td>{item.location}</td>
                                    <td>{item.booked}</td>
                                    <td>{item.must_delivery}</td>
                                    <td>{item.stock}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        )
    }
    return(
        <div>
            {
                data.length !== 0
                ?
                <div style={{marginTop: '150px', padding: 10}}>
                    {renderTable()}
                    <Pagination>
                        <Pagination.Prev disabled={page <= 1 ? true : false} onClick={() => setPage(page - 1)} />
                        {listItem.map((item, index) => {
                            return (
                                <Pagination.Item key={index} active={index+1 === page} onClick={() => setPage(index+1)}>{index+1}</Pagination.Item>
                            )
                        })}
                        <Pagination.Next disabled={page >= noOfPages ? true : false} onClick={() => setPage(page + 1)} />
                    </Pagination>
                </div>
                :
                <div></div>
            }
        </div>
    )
}

export default WarehouseStock