import React from 'react'
import './payment.css'
import { Link } from 'react-router-dom'

const PaymentS = () => {
  return (
    
      <div class="row justify-content-center h-[60vh] pay">
            <div class="col-md-5 pt-[15vh]">
                <div class="message-box _success">
                     <i class="fa fa-check-circle" aria-hidden="true"></i>
                    <h2> Your payment was successful </h2>
                   <p> Thank you for your payment</p>
                   <Link to="/">
                   <button className='button1'>
  <span className="button_top"> Home
  </span>
</button></Link>   
            </div> 
            
        </div> 
    </div> 
    
  )
}

export default PaymentS