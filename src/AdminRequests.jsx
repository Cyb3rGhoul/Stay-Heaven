import React from 'react'
import tick from './assets/tick.png'
import cross from './assets/cross.png'

const AdminRequests = () => {
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
              <td className='flex justify-center gap-5 mt-2'>
                <img src={tick} alt="tick" className='w-8 h-8 mt-[0.1rem]'/>
                <img src={cross} alt="tick" className='w-8 h-8'/>
              </td>
              <td className='text-center'>
                <button className="btn bg-zinc-200" onClick={()=>document.getElementById('my_modal_3').showModal()}>More</button>
                <dialog id="my_modal_3" className="modal">
                <div className="modal-box scrollbar-w ">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className='flex flex-col '>
                      <img className='rounded-lg my-4 mb-2' src="https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=" alt="" />
                      <h3 className="font-bold text-lg">The Grand Hotel</h3>
                      <p className="py-2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, fugiat, nobis vel itaque provident eum dignissimos cupiditate delectus aliquam laboriosam quam laudantium cum quibusdam.</p>
                      <img className='rounded-lg my-4 mb-2' src="https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=" alt="" />
                      <img className='rounded-lg my-4 mb-2' src="https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=" alt="" />
                    </div>
                  </div>
                </dialog>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminRequests