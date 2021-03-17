import React from 'react'
import 'fontsource-roboto'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    MenuItem,
    FormControl,
    Select,
    Input
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import { useSelector } from 'react-redux'

const Product = () => {
    const { products } = useSelector((state) => {
        return{
            products: state.productReducer.products
        }
    })

    // filter harga dan nama
    const options = [
        'Nama A - Z',
        'Nama Z - A',
        'Harga Tertinggi',
        'Harga Terendah',
    ]
    const [selectedOption, setSelectedOption] = React.useState([])

    const handleClickListItem = (event) => {
        const input = event.target.value
        setSelectedOption(input)

        const index = options.findIndex(item => item === input)
        if(index === 0) return products.sort((a,b) => a.name.localeCompare(b.name))
        if(index === 1) return products.sort((a,b) => -1 * a.name.localeCompare(b.name))
        if(index === 2) return products.sort((a,b) => b.price - a.price)
        if(index === 3) return products.sort((a,b) => a.price - b.price)
    }

    // filter kategori
    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    }
    const optionsCate = [
        'All',
        'Smartphone',
        'Casing & Cover',
        'Keyboard',
        'Screen Guard',
        'Smartwatch',
        'Data cable',
        'Portable Power Bank',
        'Memory Card',
        'Wireless charger',
        'Stand & Holder',
        'Stylus',
        'Virtual Reality',
        'Laptop',
        'Mini PC',
        'Playstation',
        'Mouse',
        'Antena',
        'TV',
        'CCTV',
        'Monitor',
        'Audio'
    ]
    const [selectedCate, setSelectedCate] = React.useState([])

    const handleClickListItemCate = (event) => {
        const input = event.target.value
        setSelectedCate(input)

        if(input === 'All') return setSelectedCate([])
    }

    // pagination
    const classes = useStyles()
    const theme = useTheme()
    const itemsPerPage = 12
    const [page, setPage] = React.useState(1)
    const noOfPages = selectedCate[0] ? 1 : Math.ceil(products.length / itemsPerPage)
    
    const handleChange = (event, value) => {
        setPage(value)
    }

    return (
        <div style={{padding: 10, margin: 25}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'row', width: 300}}>
                    <h3 style={{marginRight: 10}}>Kategori</h3>
                    <FormControl className={classes.formControl}>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            value={selectedCate}
                            onChange={handleClickListItemCate}
                            input={<Input />}
                            MenuProps={MenuProps}
                        >
                            {optionsCate.map((option, index) => (
                                <MenuItem
                                    key={index}
                                    value={option}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <h3 style={{marginRight: 10}}>Urutkan</h3>
                    <FormControl className={classes.formControl}>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            value={selectedOption}
                            onChange={handleClickListItem}
                            input={<Input />}
                            MenuProps={MenuProps}
                        >
                            {options.map((option, index) => (
                                <MenuItem
                                    key={index}
                                    value={option}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', flexWrap: 'wrap'}}>
                {
                    selectedCate[0]
                    ?
                    products
                        .filter(item => item.total_stock !== 0)
                        .filter(item => item.category === selectedCate)
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((item, index) => {
                            return(
                                <Card className={classes.root} key={index}>
                                    <CardActionArea onClick={() => console.log(item.id)}>
                                        <CardMedia
                                        className={classes.media}
                                        image={item.images[0]}
                                        style={{width: '200px', height: '200px', padding: 13}}
                                        />
                                        <CardContent className={classes.body}>
                                            <Typography gutterBottom variant="h6" component="h2">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="h6" color="#000000" component="h3" style={{fontWeight: 'bold'}}>
                                                IDR {item.price.toLocaleString()}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            )
                        })
                    :
                    products
                        .filter(item => item.total_stock !== 0)
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((item, index) => {
                            return(
                                <Card className={classes.root} key={index}>
                                    <CardActionArea onClick={() => console.log(item.id)}>
                                        <CardMedia
                                        className={classes.media}
                                        image={item.images[0]}
                                        style={{width: '200px', height: '200px', padding: 13}}
                                        />
                                        <CardContent className={classes.body}>
                                            <Typography gutterBottom variant="h6" component="h2">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="h6" color="#000000" component="h3" style={{fontWeight: 'bold'}}>
                                                IDR {item.price.toLocaleString()}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            )
                    })
                }
            </div>

            <div>
                <Pagination
                    count={noOfPages}
                    page={page}
                    onChange={handleChange}
                    defaultPage={1}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    classes={{ ul: classes.paginator }}
                />
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: "16.5rem",  
        margin: "10px",
    },
    media: {
        height: 140,
    },
    paginator: {
        justifyContent: "center",
        padding: "10px"
    },
    body: {
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between"
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
}))

export default Product