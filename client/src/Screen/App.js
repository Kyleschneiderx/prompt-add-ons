import './App.css';
// import { GoogleSpreadsheet } from 'google-spreadsheet';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import { getRows } from '../google';
import gapi, {load} from 'gapi-client';
import axios from 'axios';
import Header from '../components/Header/header';
import { PulseLoader } from "react-spinners";

function App(){
  
  
  const { userId } = useParams();
  const navigate = useNavigate()

  const[name, setName] = useState('')
  const[amount, setAmount] = useState('')
  const [custom, setCustom] = useState(false)
  const [pay, setPay] = useState(0)
  const [index, setIndex] = useState()
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    async function fetchData() {


      try{
        const params = {
          id: userId
        };
  
        
        
        // You can await here
        const patient = await axios.get('/patient', {params})

        console.log(patient)
        // ...
        console.log(patient.data[0])
        setIndex(patient.data[0].index)
        setName(patient.data[0].name)
        setAmount(patient.data[0].owed)

        setLoading(false);

      }catch(err){
        console.log(err)
      }


    }
    fetchData()

  }, []);

  const clickQP = async (owed)=>{
    console.log(name, owed)
    try{
      const stripe = await axios.post('/patient', {index: index  ,name: name, amount: owed})
      console.log(stripe)
      window.location.href = stripe.data
    }catch(err){
      console.log(err)
    }



  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
      const stripe = await axios.post('/patient', {name: name, amount: pay})
      console.log(stripe)
      window.location.href = stripe.data
    }catch(err){
      console.log(err)
    }
    // submit the form data to your API or backend server here
  };

  const handleAmountChange = (event) => {
    const newAmount = Math.abs(event.target.value)
    if (newAmount <= parseFloat(amount)) {
      setPay(newAmount);
    } else {
      setPay(parseFloat(amount));
    }
  };

  const handleButtonClick = () => {
    setCustom(true);
  };

  const handleButtonCancel = ()=>{
    setCustom(false)
  }



  

  
  if(loading){
    return (
      <div className="App">
        <div className='loading-container'>
        <div className="loader">
          <PulseLoader color="#008CBA" loading={loading} size={20} />
        </div>
        </div>
      </div>
    )
  }else{
    return (
    
      <div className="App">
        <Header/>
        {custom ?
        <>
          <div className="container">
          <div className="headerL">
            <h2>{name}</h2>
            <h3>Balance: {amount}</h3>
          </div>
          <form onSubmit={handleSubmit} className="form-container">
            <input type="number" value={pay} onChange={handleAmountChange} placeholder="Enter amount" className="form-input" />
            <div className="button-container">
          <div className="button-row">
            <button onClick={()=> handleButtonCancel()} type="cancel" className="form-submit-button">Cancel</button>
            <button type="submit" className="form-submit-button">Submit</button>
            </div>
          </div>
          </form>
        </div>
        </>
         : <div className="container">
        <div className="headerL">
          <h2>{name}</h2>
          <h3>Balance: {amount}</h3>
        </div>
        <div className="quick-pay-header">
            <h4>Quick Pay</h4>
        </div>
        <div className="button-container">
          <div className="button-row">
            <button onClick={()=> clickQP(parseFloat(amount)*0.25)} className="button">25% ${parseFloat(amount)*0.25}</button>
            <button onClick={()=> clickQP(parseFloat(amount)*0.50)} className="button">50% ${parseFloat(amount)*0.50}</button>
            <button onClick={()=> clickQP(parseFloat(amount)*0.75)} className="button">75% ${parseFloat(amount)*0.75}</button>
            <button onClick={()=> clickQP(parseFloat(amount)*1)} className="button">100% {amount}</button>
          </div>
          <button onClick={()=> handleButtonClick()} className="long-button">Custom Amount</button>
        </div>
      </div>}
  
      </div>
    );
  }

  }
  


export default App;
