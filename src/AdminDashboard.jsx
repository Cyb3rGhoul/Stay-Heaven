import React, { useState } from "react";
import bookings from "./assets/bookings.png";
import total from "./assets/total.png";
import profit from "./assets/profit.png";
import users from "./assets/users.png";
import PieActiveArc from "./PieActiveArc";
import ChartsOverview from "./ChartsOverview";

const AdminDashboard = () => {
  const [data, setData] = useState([
    {
      title: "Bookings",
      value: "714K",
      icon: bookings,
    },
    {
      title: "Total",
      value: "714K",
      icon: total,
    },
    {
      title: "Profit",
      value: "714K",
      icon: profit,
    },
    {
      title: "Users",
      value: "714K",
      icon: users,
    },
  ]);
  return (
    <div className="w-full h-fit px-5">
      <h1 className="text-3xl mb-10  font-semibold">Hi, Welcome Back 👋</h1>
      <div className="flex gap-5">
        {data.map((item, index) => (
          <div
            key={item.title}
            className="h-[20vh] w-1/4 transition-all duration-300 ease-in bg-[#D6EFD8] cursor-pointer hover:bg-[#43A344] hover:text-white rounded-lg p-4 flex gap-5 items-center justify-center"
          >
            <img className="size-20" src={item.icon} alt="" />
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold">{item.value}</h2>
              <p className="text-md font-semibold opacity-50">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="flex gap-5 ">
        <div className="w-1/2 my-10 flex flex-col gap-5 rounded-lg bg-[#D6EFD8] h-fit pb-10 justify-center">
          <div className="ml-2 py-4">
            <select
              className="border-2 border-black rounded-md"
              name="filter"
              id="filter"
            >
              <option value="7days">7 days</option>
              <option value="30days">30 days</option>
              <option value="1year">1 year</option>
              <option value="forever">forever</option>
            </select>
          </div>
          <PieActiveArc />
        </div>
        <div className="w-1/2 my-10 flex flex-col gap-5 rounded-lg bg-[#D6EFD8] h-fit pb-10 justify-center">
          <div className="ml-2 py-4">
            <select
              className="border-2 border-black rounded-md"
              name="filter"
              id="filter"
            >
              <option value="7days">7 days</option>
              <option value="30days">30 days</option>
              <option value="1year">1 year</option>
              <option value="forever">forever</option>
            </select>
          </div>
          <ChartsOverview />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
