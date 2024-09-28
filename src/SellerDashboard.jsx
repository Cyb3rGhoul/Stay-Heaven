import React from "react";
import PieActiveArc from "./PieActiveArc";
import "./SellerDashboard.css";

const SellerDashboard = () => {
    return (
        <div className="sell mt-12 w-full h-fit px-5">
            <h1 className="text-3xl mb-10 font-semibold text-gray-800">
                Hi, Welcome Back 👋
            </h1>
            <select
                className="border-2 border-green-500 rounded-md bg-white px-4 py-2 text-gray-700 shadow-lg focus:ring-2 focus:ring-green-300 transition-all ease-in-out duration-200 hover:border-green-600 cursor-pointer absolute top-10 right-6"
                name="filter"
                id="filter"
                onChange={(e) => {
                    setDuration(e.target.value);
                    console.log(e.target.value);
                    getAdminDashboardData(e.target.value);
                }}
            >
                <option value="overall" className="text-gray-700">Overall</option>
                <option value="This Week" className="text-gray-700">This Week</option>
                <option value="This Month" className="text-gray-700">This Month</option>
                <option value="This Year" className="text-gray-700">This Year</option>
            </select>

            <div className="flex gap-5">
                {/* {data.map((item, index) => (
            <div
                key={item.title}
                className="h-[20vh] w-1/3 relative transition-all duration-300 ease-in bg-[#6bac71] cursor-pointer hover:bg-[#43A344]  rounded-lg p-4 flex gap-5 items-center justify-center"
            >
                <img className="size-20" src={item.icon} alt="" />
                <div className="flex flex-col gap-2 text-white">
                    <h2 className="text-3xl font-semibold">
                        {formatNumber(item.value)}
                    </h2>
                    <p className="text-md font-semibold opacity-50">
                        {item.title}
                    </p>
                </div>
                            </div>
                ))} */}
                <div
                    className="h-[20vh] w-1/3 relative transition-transform duration-300 ease-in-out transform bg-[#6bac71] cursor-pointer bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg hover:scale-105 p-4 flex gap-5 items-center justify-center"
                >
                    <img
                        className="w-16 h-16"
                        src="https://cdn.iconscout.com/icon/free/png-256/airbnb-logo-2885-2194.png"
                        alt="Icon"
                    />
                    <div className="flex flex-col gap-2 text-white">
                        <h2 className="text-3xl font-semibold">123</h2>
                        <p className="text-md font-semibold opacity-75">Users</p>
                    </div>
                </div>
            </div>

            <section className="flex items-center justify-center">
                <div className="w-1/2 my-10 flex flex-col gap-5 rounded-lg bg-[#D6EFD8] h-fit pb-10 shadow-lg">
                    <PieActiveArc
                        data={[
                            { id: 0, value: 1, label: "Pending Bookings" },
                            { id: 1, value: 2, label: "Successful Bookings" },
                            { id: 2, value: 3, label: "Cancelled Bookings" },
                        ]}
                    />
                </div>
            </section>
        </div>
    );
};

export default SellerDashboard;
