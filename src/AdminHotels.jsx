import React from "react";

const AdminHotels = () => {
  return (
    <div>
      <div className="ml-2 py-4">
        <select
          className="border-2 border-black rounded-md"
          name="filter"
          id="filter"
        >
          <option value="title">title</option>
          <option value="owner">owner</option>
          <option value="price">price</option>
          <option value="city">city</option>
          <option value="state">state</option>
          <option value="approvalStatus">approval status</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="font-bold text-lg">
              <th>S.No.</th>
              <th className="text-center">Hotel Name</th>
              <th className="text-center">Owner</th>
              <th className="text-center">Price</th>
              <th className="text-center">City</th>
              <th className="text-center">State</th>
              <th className="text-center">Status</th>
              <th className="text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td className="text-center">The Grand Hotel</td>
              <td className="text-center">John Doe</td>
              <td className="text-center">$100</td>
              <td className="text-center">New York</td>
              <td className="text-center">NY</td>
              <td className="text-center">
                <select className="select bg-zinc-200 select-ghost select-sm">
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </td>
              <td className="text-center flex justify-center ">
                <button
                  className="btn bg-zinc-200"
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                >
                  More
                </button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box scrollbar-w ">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <div className="flex flex-col ">
                      <img
                        className="rounded-lg my-4 mb-2"
                        src="https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc="
                        alt=""
                      />
                      <h3 className="font-bold text-lg">The Grand Hotel</h3>
                      <p className="py-2">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Culpa, fugiat, nobis vel itaque provident eum
                        dignissimos cupiditate delectus aliquam laboriosam quam
                        laudantium cum quibusdam.
                      </p>
                      <img
                        className="rounded-lg my-4 mb-2"
                        src="https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc="
                        alt=""
                      />
                      <img
                        className="rounded-lg my-4 mb-2"
                        src="https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc="
                        alt=""
                      />
                    </div>
                  </div>
                </dialog>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHotels;
