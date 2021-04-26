import React from 'react'
import Axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import { 
    Card,
    Pagination,
    Button,
    Form
} from 'react-bootstrap'

const Product = () => {
    const [data, setData] = React.useState([])
    const [length, setLength] = React.useState(0)
    const [category, setCategory] = React.useState([])
    const [sortby, setSortby] = React.useState("asc")
    const [selectedOption, setSelectedOption] = React.useState("")
    const [selectedCate, setSelectedCate] = React.useState("")
    const itemsPerPage = 12
    const [page, setPage] = React.useState(1)
    const noOfPages = selectedCate ? 1 : Math.ceil(length / itemsPerPage)
    const listItem = Array(noOfPages).fill(1)

    React.useEffect(() => {
        const fetchData = async() => {
            try{
                const res = await Axios.get(`http://localhost:2000/products/page/1/sort=${sortby}`)
                setData(res.data)

                const res2 = await Axios.get('http://localhost:2000/products/getproduct')
                setLength(res2.data.length)
                setCategory(res2.data.category)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchData()
    }, [])

    // filter harga dan nama
    const options = [
        'Name A - Z',
        'Name Z - A',
        'Highest Price',
        'Lowest Price',
    ]

    const handleClickListItem = (e) => {
        const input = e.target.value
        setSelectedOption(input)

        let sortby
        if(input === 'Name A - Z') {
            sortby = 'asc'
            setSortby('asc')
        }
        if(input === 'Name Z - A') {
            sortby = 'desc'
            setSortby('desc')
        }
        if(input === 'Highest Price') {
            sortby = 'priceHigh'
            setSortby('priceHigh')
        }
        if(input === 'Lowest Price') {
            sortby = 'priceLow'
            setSortby('priceLow')
        }

        let API
        if(selectedCate) API = `http://localhost:2000/products/category/${selectedCate}/sort=${sortby}`
        if(!selectedCate) API = `http://localhost:2000/products/page/${page}/sort=${sortby}`

        const fetchData = async() => {
            try{
                const res = await Axios.get(API)
                setData(res.data)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchData()
    }

    // filter kategori
    const optionsCate = ['All', ...category]

    // pagination
    const paginationHandler = (page) => {
        const fetchData = async() => {
            try{
                const res = await Axios.get(`http://localhost:2000/products/page/${page}/sort=${sortby}`)
                setData(res.data)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchData()

        setPage(page)
    }

    const handleClickListItemCate = (e) => {
        const input = e.target.value
       
        let API
        if(input === 'All') {
            API = `http://localhost:2000/products/page/1/sort=${sortby}`
            setSelectedCate("")
        } else {
            API = `http://localhost:2000/products/category/${input}/sort=${sortby}`
            setSelectedCate(input)
        }
        
        const fetchData = async() => {
            try{
                const res = await Axios.get(API)
                setData(res.data)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchData()
        setPage(1)
    }

    return (
        <div style={{padding: 10, margin: 25, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', marginLeft: 60}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
                <div style={{display: 'flex', flexDirection: 'row', marginRight: 20}}>
                    <h3 style={{marginRight: 10}}>Category</h3>
                    <Form.Control 
                        as="select" 
                        value={selectedCate ? selectedCate : ""} 
                        onChange={(e) => handleClickListItemCate(e)}
                    >
                        <option>Choose category ... </option>
                        {
                            optionsCate.map((item, index) => {
                                return (<option key={index} value={item}>{item}</option>)
                            })
                        }
                    </Form.Control>
                </div>

                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <h3 style={{marginRight: 10}}>Sort</h3>
                    <Form.Control 
                        as="select" 
                        value={selectedOption ? selectedOption : ""} 
                        onChange={(e) => handleClickListItem(e)}
                    >
                        {
                            options.map((item, index) => {
                                return (<option key={index} value={item}>{item}</option>)
                            })
                        }
                    </Form.Control>
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', flexWrap: 'wrap'}}>
                    {data.map((item, index) => {
                            return(
                                <Card style={styles.card} key={index}>
                                    <Card.Img variant="top" src={item.images[1]} style={{width: 170, height: 170}} />
                                    <Card.Body style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                        <Card.Title style={{ fontSize: 18}}>{item.name}</Card.Title>
                                        <Card.Text style={{height: "2rem", fontSize: 17}}>
                                            IDR {item.price.toLocaleString()}
                                        </Card.Text>
                                    </Card.Body>
                                    <Button style={{margin: "20px 10px", backgroundColor: '#118ab2', width: 100}} as={Link} to={`/detail?id=${item.id}`}>
                                        <i class="fas fa-shopping-cart"></i> Buy
                                    </Button>
                                </Card>
                            )
                    })}
            </div>

            <div style={{marginTop: 20}}>
                <Pagination>
                    <Pagination.Prev disabled={page <= 1 ? true : false} onClick={() => paginationHandler(page - 1)} />
                    {listItem.map((item, index) => {
                        return (
                            <Pagination.Item key={index} active={index+1 === page} onClick={() => paginationHandler(index+1)}>{index+1}</Pagination.Item>
                        )
                    })}
                    <Pagination.Next disabled={page >= noOfPages ? true : false} onClick={() => paginationHandler(page + 1)} />
                </Pagination>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: "flex", 
        flexWrap: "wrap",
        justityContent: "space-between", 
    },
    card: {
        width: "16rem",
        height: "25rem",  
        margin: "10px",
        alignItems: "center"
    }
}

export default Product