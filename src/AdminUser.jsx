import React from 'react'

const AdminUser = () => {
  return (
    <div>
      <div className="ml-2 py-4">
        <select
          className="border-2 border-black rounded-md"
          name="filter"
          id="filter"
        >
          <option value="select">select</option>
          <option value="username">username</option>
          <option value="email">email</option>
          <option value="previousBookings">previous bookings</option>
          <option value="myCreatedPlaces">my created places</option>
          <option value="admin">admin</option>
          <option value="seller">seller</option>
          <option value="receivedOrders">received orders</option>
        </select>
      </div>
        <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className='font-bold text-lg'>
              <th>S.No.</th>
              <th className='text-center'>Username</th>
              <th className='text-center'>Email</th>
              <th className='text-center'>Full Name</th>
              <th className='text-center'>Phone Number</th>
              <th className='text-center'>Past Bookings</th>
              <th className='text-center'>Admin</th>
              <th className='text-center'>Seller</th>
              <th className='text-center'>Created Hotels</th>
              <th className='text-center'>Orders</th>
              <th className='text-center'>Ban User</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className='text-center'>1</th>
              <td>
                <div className="flex items-center gap-3 text-center">
                    <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                        <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="Avatar Tailwind CSS Component" />
                    </div>
                    </div>
                    <div>
                    <div className="font-bold">HartHagerty</div>
                    </div>
                </div>
              </td>
              <td className='text-center'>ramji@gmail.com</td>
              <td className='text-center'>Hart Hagerty</td>
              <td className='text-center'>+91 9876543210</td>
              <td className='text-center'>
                <select className='select bg-zinc-200 select-ghost select-sm'
                value=""
                >
                <option value="" disabled selected>order id</option>
                  <option >54654679856325654</option>
                </select>
              </td>
              <td className='text-center  mt-2  '>
                <select className='select bg-zinc-200 select-ghost select-sm'
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </td>
              <td className=''>
              <select className='select bg-zinc-200 select-ghost select-sm'
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </td>
              <td className='text-center'>
              <select className='select bg-zinc-200 select-ghost select-sm'
                value=""
                >
                <option value="" disabled selected>Hotel id</option>
                  <option>54654679856325654</option>
                </select>
              </td>
              <td>
              <select className='select bg-zinc-200 select-ghost select-sm'
                value=""
                >
                <option value="" disabled selected>Received Order id</option>
                  <option>54654679856325654</option>
                </select>
              </td>
              <td>
                <select className='select bg-zinc-200 select-ghost select-sm'>
                    <option>No</option>
                    <option>Yes</option>
                  </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUser