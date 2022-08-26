import React, { useEffect, useState } from 'react'
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
import { connect } from 'react-redux';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Header from './Header.component';
import { fetchBikes, fetchUser } from '../../redux/action';
import Modal from 'antd/lib/modal/Modal';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";


function CreatedBikes({state,fetchUser,fetchBikes}) {
    const navigate=useNavigate();

  const [bikes, setBikes] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if(document.cookie.split('=')[1]==='jwt')
    {
        fetchUser()
        
    }
    else{
        navigate('/auth')
    } 
}, [])



  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (id,reserve) => {
    axios.delete(`http://localhost:3001/bikes/${id}/delete`,{
      headers:{
        jwt: JSON.parse(localStorage.getItem('token')).jwt
      }
  })
    .then(response => {
      fetchBikes()
    })
    setIsModalVisible(false);
    toast.success('Bike Deleted Successfully')

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (state.loading) ? (
    <></>
  ):state.error?(
    <h2>{state.error}</h2>
  ):(
    <>
    <Header/>
    <Button 
    onClick={()=>{navigate('/home')}}
    variant='outlined'
    sx={{mt:3}}>
        HomePage
    </Button>
    {
        state.bikes.map((value,key)=>{
            return(value.managedBy===state.user.email)? (
                
    <Stack 
    key={key.toString()} 
    direction={'row'} 
    justifyContent='center' 
    sx={{m:1,mt:4}}>
    <Card 
    sx={{ 
        maxWidth: 345, 
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
        
        {value.rating}

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
      </CardContent>
      <CardActions>
        <Button 
        size="small"
        onClick={()=>{showModal()}}>
            Delete
        </Button>
        <Modal 
        title="Delete Bike" 
        visible={isModalVisible} 
        onOk={()=>handleOk(value.id,value.reserver)} 
        onCancel={()=>handleCancel()}>
        <p>Do you really want to delete the bike?</p>
      </Modal>
      <ToastContainer/>
      </CardActions>
    </Card>
</Stack>
            
            ):''
        })
    }
    </>
  )
}

const mapStateToProps = (state) => {
    return{
      state:state
    }
  }

const mapDispatchToProps = dispatch => {
    return {
        fetchUser: () => dispatch(fetchUser()),
        fetchBikes: () => dispatch(fetchBikes()),

    } 
}
  
export default connect(mapStateToProps, mapDispatchToProps)(CreatedBikes)