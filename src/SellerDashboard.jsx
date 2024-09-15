import React from "react";
import PieActiveArc from "./PieActiveArc";

const SellerDashboard = () => {
    return <div className="w-full h-fit px-5">
    <h1 className="text-3xl mb-10  font-semibold">
        Hi, Welcome Back 👋
    </h1>
    <select
        className="border-2 absolute top-10 right-6 border-black  rounded-md"
        name="filter"
        id="filter"
        onChange={(e) => {
            setDuration(e.target.value);
            console.log(e.target.value);
            getAdminDashboardData(e.target.value);
        }}
    >
        <option value="overall">overall</option>
        <option value="This Week">This week</option>
        <option value="This Month">This month</option>
        <option value="This Year">This year</option>
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
                className="h-[20vh] w-1/3 relative transition-all duration-300 ease-in bg-[#6bac71] cursor-pointer hover:bg-[#43A344]  rounded-lg p-4 flex gap-5 items-center justify-center"
            >
                <img className="size-20" src="https://cdn.iconscout.com/icon/free/png-256/airbnb-logo-2885-2194.png" alt="" />
                <div className="flex flex-col gap-2 text-white">
                    <h2 className="text-3xl font-semibold">
                        123
                    </h2>
                    <p className="text-md font-semibold opacity-50">
                        user
                    </p>
                </div>
            </div>
    </div>

    <section className="flex items-center justify-center ">
        <div className="w-1/2 my-10 flex flex-col gap-5 rounded-lg bg-[#D6EFD8] h-fit pb-10 justify-center">
            <div className=" py-2"></div>
            <PieActiveArc
                data={[
                    { id: 0, value: 1, label: "Pending Bookings" },
                    { id: 1, value: 2, label: "Successful Bookings" },
                    { id: 2, value: 3, label: "Cancelled Bookings" },
                ]}
            />
        </div>
    </section>
</div>;
};

export default SellerDashboard;
