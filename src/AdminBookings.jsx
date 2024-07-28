import React from 'react'

const AdminBookings = () => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className='font-bold text-lg'>
              <th>S.No.</th>
              <th className='text-center'>Order Id</th>
              <th className='text-center'>Hotel Details</th>
              <th className='text-center'>Check-in Date</th>
              <th className='text-center'>Check-out Date</th>
              <th className='text-center'>Rooms</th>
              <th className='text-center'>Amount</th>
              <th className='text-center'>Guest Details</th>
              <th className='text-center'>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className='text-center'>1</th>
              <td className='text-center'>4355534</td>
              <td className='text-center'>
              <button className="btn bg-zinc-200" onClick={()=>document.getElementById('my_modal_3').showModal()}>More</button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click on ✕ button to close</p>
                  </div>
                </dialog>
              </td>
              <td className='text-center'>2022-10-01</td>
              <td className='text-center'>2022-10-05</td>
              <td className='text-center'>2</td>
              <td className='text-center'>$1000</td>
              <td className='text-center'>
              <button className="btn bg-zinc-200" onClick={()=>document.getElementById('my_modal_3').showModal()}>More</button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click on ✕ button to close</p>
                  </div>
                </dialog>
              </td>
              <td className='text-center'>Confirmed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminBookings