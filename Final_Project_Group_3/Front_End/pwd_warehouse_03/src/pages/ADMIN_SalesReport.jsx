import React from 'react'
import Axios from 'axios'
import { useDispatch } from 'react-redux'
import {
    Table,
    Pagination,
    Form,
    Dropdown,
    Nav
} from 'react-bootstrap'

const SalesReport = () => {
    const dispatch = useDispatch()

    let [data, setData] = React.useState([])
    const [selectedOption, setSelectedOption] = React.useState("")

    React.useEffect(() => {
        async function fetchData() {
            try {
                let res = await Axios.get(`http://localhost:2000/cart/order_listing`)
                setData(res.data)
            }
            catch (err) {
                console.log(err)
            }

        }
        fetchData()
    }, [])

    console.log(data)

    const options = [
        'Total Belanja Tertinggi',
        'Total Belanja Terendah',
    ]

    const handleClickListItem = (e) => {
        const input = e.target.value
        setSelectedOption(input)

        if (input === 'Total Belanja Tertinggi') return data.sort((a, b) => b.total - a.total)
        if (input === 'Total Belanja Terendah') return data.sort((a, b) => a.total - b.total)
    }
    // pagination
    const itemsPerPage = 10
    const [page, setPage] = React.useState(1)
    const noOfPages = Math.ceil(data.length / itemsPerPage)
    const listItem = Array(noOfPages).fill(1)


    const renderTable = () => {
        return (
            <Table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Date</th>
                        <th>Order Number</th>
                        <th>Product Name</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((item, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.date}</td>
                                        <td>{item.order_number}</td>
                                        <td>{item.name}</td>
                                        <td>{item.payment_method}</td>
                                        <td>{item.status}</td>
                                        <td>{item.quantity}</td>
                                        <td>{new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'IDR' }).format(item.price)}</td>
                                        <td>{new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'IDR' }).format(item.total)}</td>
                                    </tr>
                                )
                            })
                    }
                </tbody>
            </Table>
        )
    }

    return (
        <div>
            {
                data.length !== 0
                    ?
                    <div style={{ marginTop: '90px', padding: 30 }}>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'row'}}>
                                <Nav variant="pills" defaultActiveKey="/get_all" style={{marginLeft: "2vw"}}>
                                    <Nav.Item>
                                        <Nav.Link href="/sales_report">Main Sales Report</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="/most_buy">Most buy product</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <h5 style={{ marginRight: 10}}>Sort By</h5>
                                <Form.Control 
                                    as="select" 
                                    value={selectedOption ? selectedOption : ""} 
                                    onChange={(e) => handleClickListItem(e)}
                                    style={{width: 250}}
                                >
                                    <option>Choose filter ... </option>
                                    {
                                        options.map((item, index) => {
                                            return (<option key={index} value={item}>{item}</option>)
                                        })
                                    }
                                </Form.Control>
                            </div>
                        </div>
                        {renderTable()}
                        <Pagination>
                            <Pagination.Prev disabled={page <= 1 ? true : false} onClick={() => setPage(page - 1)} />
                            {listItem.map((item, index) => {
                                return (
                                    <Pagination.Item key={index} active={index + 1 === page} onClick={() => setPage(index + 1)}>{index + 1}</Pagination.Item>
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

export default SalesReport