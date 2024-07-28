import React from 'react'

const AdminBookings = () => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className='font-bold text-lg'>
              <th>S.No.</th>
              <th className='text-center'>Hotel Name</th>
              <th className='text-center'>Owner</th>
              <th className='text-center'>Price</th>
              <th className='text-center'>City</th>
              <th className='text-center'>State</th>
              <th className='text-center'>Status</th>
              <th className='text-center'>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td className='text-center'>The Grand Hotel</td>
              <td className='text-center'>John Doe</td>
              <td className='text-center'>$100</td>
              <td className='text-center'>New York</td>
              <td className='text-center'>NY</td>
              <td className='text-center'>
                <select className='select bg-zinc-200 select-ghost select-sm'>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminBookings