import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Card } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Header from './Header.component';
import { fetchBikes, fetchUser } from '../../redux/action';
import Modal from 'antd/lib/modal/Modal';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


function MyBikes({state,fetchUser,fetchBikes}){

    const navigate=useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalReviewVisible, setIsModalReviewVisible] = useState(false);
    const [writeReview, setWriteReview] = useState('')
    const [isReserved, setIsReserved] = useState(false)
    const [cancelReservationDate, setCancelReservationDate] = useState('')
    const [reservedDates, setReservedDates] = useState([{'reservedFrom':'','reservedUntil':''}])
    const [showReviewsAndRatings, setShowReviewsAndRatings] = useState(false)

    const [reviewAndRatingKey, setReviewAndRatingKey] = useState([-1,-1])
    const [bikesCategory, setBikesCategory] = useState('reserved')
    const [reservedColor, setReservedColor] = useState('lightBlue')
    const [cancelledColor, setCancelledColor] = useState('white')
    const [cancelReservationPara, setCancelReservationPara] = useState(
      {
        id:null,
        reserve:null,
        reservedFrom:null,
        reservedUntil:null
      })

    // useEffect(() => {
    //     if(localStorage.getItem('token')!==null && localStorage.getItem('token')!==undefined &&
    //     localStorage.getItem('token')!=='' && JSON.parse(localStorage.getItem('token')).expiry>new Date().getTime())
    //     {
    //         fetchUser()
            
    //     }
    //     else{
    //         localStorage.clear()
    //         navigate('/auth')
    //     } 
    // }, [])

    useEffect(() => {
      fetchBikes();
    }, [])

    useEffect(() => {
      
    }, [])
     
    


const showModal = () => {
  setIsModalVisible(true);
};

const showModalReview=(key,kee)=>{
  setShowReviewsAndRatings(true)
  setReviewAndRatingKey([key,kee])
  // setIsModalReviewVisible(true)
}  

const handleOk = () => {

  axios.put(`http://localhost:3001/bikes/${cancelReservationPara.id}/cancelReserve`,{
      reservedFrom:cancelReservationPara.reservedFrom,
      reservedUntil:cancelReservationPara.reservedUntil
  },{
      headers:{
        jwt: JSON.parse(localStorage.getItem('token')).jwt
      }
  })
  .then((data)=>{

      setCancelReservationDate('');
      fetchBikes();

    
      toast.success('success')
      setIsModalVisible(false);

  })
  .catch((err)=>{
      console.log(err)
  })

  setIsModalVisible(false);
};
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
      const handleCancelReview=()=>{
        setIsModalReviewVisible(false);
      }

      const rate=(key,id,rating,reservedFrom)=>{

        axios.put(`http://localhost:3001/bikes/${id}/updateRate`,{
            rate:key,
            reservedFrom:reservedFrom
        },{
            headers:{
              jwt: JSON.parse(localStorage.getItem('token')).jwt
            }
        })
        .then((data)=>{ 
            fetchBikes()
        })
        .catch((err)=>{
          console.log(err)
        })
      }

      const review=(key,id,rating,reservedFrom)=>{
        if(writeReview.trim().length === 0)
        {
          toast.error('Cannot write empty review')
          return 
        }

        axios.put(`http://localhost:3001/bikes/${id}/updateRate`,{
            review:writeReview,
            reservedFrom:reservedFrom
        },{
            headers:{
              jwt: JSON.parse(localStorage.getItem('token')).jwt
            }
        })
        .then((data)=>{ 
            
            setIsModalReviewVisible(false)
            setWriteReview('')
            fetchBikes()

            setTimeout(() => {
              toast.success('Review has been added')
            }, 2000);

        })

      }

      const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
        },
      }));

    return (state.loading) ? (
        <><><CircularProgress/></></>
      ):state.error?(
        <h2>{state.error}</h2>
      ):(
        <>
      
    <div style={{'backgroundColor':'antiqueWhite','height':'100vh'}}>
    <Header/>
    <Stack
    direction={'row'} 
    // justifyContent='center'
    // alignContent={/'center'}
    sx={{backgroundColor:'white',m:'auto',mt:5,maxWidth:'50%',minWidth:'200px','borderRadius':'5px'}}>
      <Box 
      sx={bikesCategory==='reserved'?{backgroundColor:'lightBlue',fontSize:'20px',cursor:'pointer',width:'50%',borderRadius:'5px 0 0 5px'}:{fontSize:'20px',cursor:'pointer',width:'50%'}}
      onClick={()=>{setBikesCategory('reserved');setReservedColor('lightBlue'); setCancelledColor('white')}}>
        Reserved Bikes
      </Box>
      <Box 
      sx={bikesCategory==='cancelled'?{backgroundColor:'lightBlue',fontSize:'20px',cursor:'pointer',width:'50%',borderRadius:'0 5px 5px 0'}:{fontSize:'20px',cursor:'pointer',width:'50%'}}
      onClick={()=>{setBikesCategory('cancelled');
      setReservedColor('white'); 
      setCancelledColor('lightBlue')}}>
      Cancelled Bikes
      </Box>
    </Stack>
        {
            state.bikes.map((value,key)=>{
                return(
                    value.reserver!== null?state.user.id in JSON.parse(value.reserver):false
                    )? (
                        
                    
        <Stack 
        key={key.toString()}  
        
        justifyContent='center'  
        sx={{m:1}}
        >
            {
            JSON.parse(value.reserver)[state.user.id].map((element,kee)=>( bikesCategory==='reserved'?(element.cancelled!==true?true:false):bikesCategory==='cancelled'?(element.cancelled===true?true:false):false)?(
                <Stack
                key={kee} 
                direction={'row'} 
                justifyContent='center' 
                sx={{m:1,mt:4}}
                >
        <Card 
        sx={{ 
            maxWidth: 245, 
            minWidth:245 
            }}>
          <CardContent>
            <Typography 
            gutterBottom variant="h5" 
            component="div">
              {value.model}
            </Typography>
            <Typography 
            gutterBottom 
            component="div">
              {value.color}
            </Typography>
           {bikesCategory==='reserved' &&<div>
                   {showReviewsAndRatings===false ||reviewAndRatingKey[0]!==key || reviewAndRatingKey[1]!==kee?<Link href='#' onClick={()=>{showModalReview(key,kee)}}>Rating and Review</Link>:''}
                   <br /></div>}
{showReviewsAndRatings && reviewAndRatingKey[0]===key && reviewAndRatingKey[1]===kee?<div>
            {
                [1,2,3,4,5].map((val,k)=>{
                    
                    return(value.rating===null?true: value.rating!==null?(state.user.id in JSON.parse(value.rating)===false?true:false):false)?(
                    <StarOutlineIcon 
                    key={k.toString()}
                    color={'success'} 
                    style={{'cursor':'pointer'}}
                    onClick={()=>{rate(k+1,value.id,value.rating,element.reservedFrom)}}/>
                    ):
                    (value.rating!==null?(JSON.parse(value.rating)[state.user.id].findIndex(i=>(i.reservedFrom===element.reservedFrom && i.rate !==0))!==-1?(k+1<=JSON.parse(value.rating)[state.user.id][JSON.parse(value.rating)[state.user.id].findIndex(i=>(i.reservedFrom===element.reservedFrom))].rate?true:false):false):false)?
                    <StarIcon 
                    key={k} 
                    color={'success'}
                    />:
                    (value.rating!==null?(state.user.id in JSON.parse(value.rating) && JSON.parse(value.rating)[state.user.id].some((el)=>{
                      return (el.reservedFrom===element.reservedFrom && el.rate!==0)
                    })===true?true:false):false)?(
                      <StarOutlineIcon 
                    key={k}
                    color={'success'}
                    />
                    ):
                    <StarOutlineIcon 
                    key={k}
                    color={'success'}
                    style={{'cursor':'pointer'}}
                    onClick={()=>{rate(k+1,value.id,value.rating,element.reservedFrom)}}/>
                }) 
            }
<br />
            
            <Stack 
        justifyContent='center' 
        >
            <br />
            {
            (value.rating!==null?(state.user.id in JSON.parse(value.rating)?(JSON.parse(value.rating)[state.user.id].findIndex((el)=>(el.reservedFrom===element.reservedFrom && el.review!==""))===-1?true:false):true):true)?
                (<Stack><TextField 
            id="outlined-basic"
            label="Write review"
            variant="outlined"
            name='Write review'
            onChange={(e)=>{setWriteReview(e.target.value)}}
            value={writeReview}/> <Button onClick={()=>review(key,value.id,value.rating,element.reservedFrom)}>Submit</Button></Stack>):
            JSON.parse(value.rating)[state.user.id].findIndex((el)=>(el.reservedFrom===element.reservedFrom))!==-1?JSON.parse(value.rating)[state.user.id][JSON.parse(value.rating)[state.user.id].findIndex((el)=>(el.reservedFrom===element.reservedFrom))].review:''} 
          </Stack>    </div>:''
}          {/* </Modal> */}
          <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'flex-end' 
                }}>
            <LocationOnIcon 
            sx={{ 
                color: 'action.active', 
                mr: 1, 
                my: 0.5 
                }} />
            <Typography 
            gutterBottom 
            component="div"> 
              {value.city}
            </Typography>
    
          </Box>
          <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Reservation date</Typography>
            <div>
                {'from '+element.reservedFrom}
            </div>
            <div> 
            {'to '+element.reservedUntil}
            </div> 
            
          </React.Fragment>
        }
      >
        <Button 
        size="small">Reservation Dates</Button>
      </HtmlTooltip>
         
          </CardContent>
          {bikesCategory==='reserved' &&<CardActions 
        direction={'row'} 
        >
            <Button 
            size="small"
            color='error' 
            onClick={()=>{showModal();
            setCancelReservationPara({id:value.id,reserve:value.reserver,reservedFrom:element.reservedFrom,reservedUntil:element.reservedUntil});}}>
                Cancel Reservation 
            </Button>
            <Modal title="Cancel Reservation" visible={isModalVisible} onOk={()=>handleOk()} onCancel={()=>handleCancel()}>
        <div>
            <p>Do you really want to cancel reservation?
            </p>
        </div>  

      </Modal>
          </CardActions>}
        </Card>
      <ToastContainer/>
        
        </Stack>):'')}
    </Stack>
                
                ):''
            })
        } 
        {
            state.bikes.some((val,index,array)=>{
                if(val.reserver!== null)
                {
                    return state.user.id in JSON.parse(val.reserver) 
                    
                }

            })===false?<h1>No bikes reserved by user</h1>:''
        }
        
        </div> 
        </>
      )
}


const mapStateToProps = (state) => {
    return {
        state: state
      }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      fetchUser: () => dispatch(fetchUser()),
      fetchBikes: () => dispatch(fetchBikes()),
      
  
    } 
  }

export default connect(mapStateToProps,mapDispatchToProps)(MyBikes) 