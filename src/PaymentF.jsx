import React from 'react'
import './payment.css'

const PaymentF = () => {
  return (
    
      <div class="row justify-content-center h-[60vh] _failed">
            <div class="col-md-5 pt-[15vh] ">
                <div class="message-box _success ">
                <i class="fa fa-times-circle" aria-hidden="true"></i>
                    <h2> Your payment failed </h2>
                   <p> Try again later</p>      
                   <button className='button1'>
  <span className="button_top"> Home
  </span>
</button>
            </div> 
            
        </div> 
    </div> 
    
  )
}

export default PaymentF