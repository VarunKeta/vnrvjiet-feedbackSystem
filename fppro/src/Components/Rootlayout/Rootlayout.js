import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
function Rootlayout() {
  return (
    <div className='root1'>
       <Header/>
       <div style={{ minHeight: "60vh"}} >
        <div className="container ">
          {" "}
          <Outlet />
        </div>
       
      </div>
    </div>
  )
}

export default Rootlayout;