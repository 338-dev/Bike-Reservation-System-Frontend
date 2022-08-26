import React,{useState} from 'react'
import Button from '@mui/material/Button' 
import { Modal } from 'antd';
import { connect } from 'react-redux';
// import { fetchUser } from '../../redux/action';
import { fetchBikes, fetchFilteredBikes } from '../../redux/action';
import { useEffect } from 'react';
import { fetchBikesWithDates } from '../../redux/action';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios'

 


const Filter = ({state,fetchBikes,fetchBikesWithDates,dates,setHomeFilter,fetchFilteredBikes}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState({
      model:[],
      color:[],
      city:[],
      minRating:0
    })

    

    const filterBikes=()=>{
      fetchFilteredBikes(dates,filter)
    }
    
    const clearFilter=()=>{
      setHomeFilter({
        model:[],
        color:[],
        city:[],
        minRating:0
      })
      setFilter({
        model:[],
        color:[],
        city:[],
        minRating:0
      })
      fetchFilteredBikes(dates,{
        model:[],
        color:[],
        city:[],
        minRating:0
      })
    }

    const uniqueFilter=(prop,max,type)=>{
        for(let i=0;i<max;i++)
        {
          if(state.allBikes[i][type]===prop)
          {
            return false
          }
        }
        return true
    }


return (<>
    <Button type="primary" onClick={() => setModalVisible(true)}>
    Filters
    <FilterListIcon/>
  </Button>
  <Modal
    title="Select Filter"
    style={{ top: 20 }}
    visible={modalVisible}
    onOk={() => setModalVisible(false)}
    onCancel={() => setModalVisible(false)}
    footer={[
      <Button 
      key="back" 
      color='error' 
      onClick={()=>{clearFilter();setModalVisible(false)}}>
        Clear Filter
      </Button>,
      <Button 
      key="submit" 
      type="primary" 
      onClick={()=>{setHomeFilter(filter); filterBikes();setModalVisible(false);}}>
        Set Filter
      </Button>,
      
    ]}

  >
    <p>Filter by</p>
    <div className='filterParent'>
      <div className='filterModel'>
        Model
        <br />
        <div className='filterModelChild'>
    {
        
        state.allBikes.map((value,key)=>{
          // setBike([...bike,value])
          return(uniqueFilter(value.model,key,'model'))?(
        <div key={key}>
          <input type="checkbox" onChange={()=>{
            if(filter.model.indexOf(value.model)===-1)
            {
              setFilter({...filter,model:[...filter.model,value.model]})  
              console.log('add')
            }
            else{
              let tmparr=filter.model;
              tmparr.splice(tmparr.indexOf(value.model),1)
              setFilter({...filter,model:tmparr})
              console.log('rem')

            } 
            }}/>
          {" "+value.model}
        </div>
          ):''
        })        
    }  
    </div>
    </div>
    <div className='filterColor'>
      Color 
      <div className='filterColorChild'>
    {
       state.allBikes.map((value,key)=>{ 
        return(uniqueFilter(value.color,key,'color'))?(
        <div key={key}>
          <input type="checkbox" onChange={()=>{
            if(filter.color.indexOf(value.color)===-1)
            {
              setFilter({...filter,color:[...filter.color,value.color]})  
              console.log('add')
            }
            else{
              let tmparr=filter.color;
              tmparr.splice(tmparr.indexOf(value.color),1)
              setFilter({...filter,color:tmparr})
              console.log('rem')

            } 
            }}/>
          {" "+value.color.charAt(0).toUpperCase() + value.color.slice(1)}
        </div>
          ):''
      })
    }  
    </div>
    </div>
    <div className='filterCity'>
      City
      <div className='filterCityChild'>
    { 
       state.allBikes.map((value,key)=>{ 
        return(uniqueFilter(value.city,key,'city'))?(
        <div key={key}>
          <input type="checkbox" onChange={()=>{
            if(filter.city.indexOf(value.city)===-1)
            {
              setFilter({...filter,city:[...filter.city,value.city]})  
              console.log('add')
            }
            else{
              let tmparr=filter.city;
              tmparr.splice(tmparr.indexOf(value.city),1)
              setFilter({...filter,city:tmparr})

            } 
            }}/>
          {" "+value.city}
        </div>
          ):''
      })
    }  
    </div>
    </div>
    <div className='filterRating'>
      Rating
      <div className='filterRatingChild'>

      { [0,1,2,3,4].map((ele,key)=>(
        <div key={key}>
          <input type="radio" name='rating' value={ele} onChange={(e)=>setFilter({...filter,minRating:parseInt(e.target.value)})}/>
          {'>'+ele}
        </div> 
      )) }
      </div>
    </div>
    </div> 
    
  </Modal>
  </>)
}

const mapStateToProps = (state) => {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return {
    // fetchUser: () => dispatch(fetchUser()),
    fetchBikes: () => dispatch(fetchBikes()),
    fetchBikesWithDates: (date,filter) => dispatch(fetchBikesWithDates(date,filter)),
    fetchFilteredBikes: (date,filter,id) => dispatch(fetchFilteredBikes(date,filter,id))


  } 
}

export default connect(mapStateToProps,mapDispatchToProps)(Filter)