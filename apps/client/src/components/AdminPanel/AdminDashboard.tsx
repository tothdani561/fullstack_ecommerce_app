import { useState } from "react";
import { FaBox, FaShoppingCart, FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa";

import { PieChart } from '@mui/x-charts/PieChart';

import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useMonthlyCompletedOrders, useRecentOrders, useSalesData, useTotalOrders, useTotalProducts, useTotalUsers } from "./service/useAdminStats";

const getTotalSalesByCategory = (salesDataObj: any) => {
    if (!salesDataObj || !salesDataObj.salesData) return { 
        UNIQUE_FLOWER_ARRANGEMENTS: 0, 
        DRY_PLANT_MOSS_ART: 0, 
        UNIQUE_WIRE_JEWELRY: 0 
    };

    return salesDataObj.salesData.reduce(
        (acc: { UNIQUE_FLOWER_ARRANGEMENTS: number; DRY_PLANT_MOSS_ART: number; UNIQUE_WIRE_JEWELRY: number }, item: any) => {
            acc.UNIQUE_FLOWER_ARRANGEMENTS += item.UNIQUE_FLOWER_ARRANGEMENTS;
            acc.DRY_PLANT_MOSS_ART += item.DRY_PLANT_MOSS_ART;
            acc.UNIQUE_WIRE_JEWELRY += item.UNIQUE_WIRE_JEWELRY;
            return acc;
        },
        { UNIQUE_FLOWER_ARRANGEMENTS: 0, DRY_PLANT_MOSS_ART: 0, UNIQUE_WIRE_JEWELRY: 0 }
    );
};

const AdminDashboard = () => {
    const [showAllOrders, setShowAllOrders] = useState(false);
    const { data: totalProducts, isLoading: isLoadingProducts } = useTotalProducts();
    const { data: totalOrders, isLoading: isLoadingOrders } = useTotalOrders();
    const { data: totalUsers, isLoading: isLoadingUsers } = useTotalUsers();
    const { data: totalOrdersThisMonth, isLoading: isLoadingMonthlyOrders } = useMonthlyCompletedOrders();
    const { data: salesData, isLoading: isLoadingSalesData } = useSalesData();
    const { data: recentOrders, isLoading: isLoadingRecentOrders } = useRecentOrders();
    const totalSales = salesData ? getTotalSalesByCategory(salesData) : {
        UNIQUE_FLOWER_ARRANGEMENTS: 0,
        DRY_PLANT_MOSS_ART: 0,
        UNIQUE_WIRE_JEWELRY: 0
    };
    const visibleOrders = recentOrders && Array.isArray(recentOrders) ? (showAllOrders ? recentOrders : recentOrders.slice(0, 5)) : [];

    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedOrders = [...visibleOrders].sort((a, b) => {
        if (!sortColumn) return 0;

        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (typeof valueA === "string" && typeof valueB === "string") {
            return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }

        if (typeof valueA === "number" && typeof valueB === "number") {
            return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }

        if (sortColumn === "createdAt") {
            return sortDirection === "asc"
                ? new Date(valueA).getTime() - new Date(valueB).getTime()
                : new Date(valueB).getTime() - new Date(valueA).getTime();
        }

        return 0;
    });

    const stats = [
        { icon: <FaBox className="text-yellow-500 text-3xl" />, label: "Összes termék", value: isLoadingProducts ? "Loading..." : totalProducts },
        { icon: <FaShoppingCart className="text-green-500 text-3xl" />, label: "Összes leadott rendelés", value: isLoadingOrders ? "Loading..." : totalOrders },
        { icon: <FaShoppingCart className="text-red-500 text-3xl" />, label: "Havi leadott rendelések", value: isLoadingMonthlyOrders ? "Loading..." : totalOrdersThisMonth },
        { icon: <FaUsers className="text-green-500 text-3xl" />, label: "Regisztrált felhasználók", value: isLoadingUsers ? "Loading..." : totalUsers },
    ];

    const chartSetting = {
        yAxis: [
            {
            label: 'Megvásárolt (db)',
            },
        ],
        width: 500,
        height: 250,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-10px, 0)',
            },
            marginLeft: '20px',
        },
    };

    const formattedSalesData = salesData && Array.isArray(salesData.salesData) ? salesData.salesData.map((item: any) => ({
        month: item.month,
        UNIQUE_FLOWER_ARRANGEMENTS: item.UNIQUE_FLOWER_ARRANGEMENTS,
        DRY_PLANT_MOSS_ART: item.DRY_PLANT_MOSS_ART,
        UNIQUE_WIRE_JEWELRY: item.UNIQUE_WIRE_JEWELRY
    })) : [];

    return (
        <div className="p-6 w-full min-h-screen text-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="border p-6 rounded-lg shadow-md flex flex-col items-center">
                        {stat.icon}
                        <h3 className="text-lg text-gray-700 font-bold mt-3">{stat.value}</h3>
                        <p className="text-gray-700 text-center">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border p-2 rounded-lg h-60 shadow-md flex items-center justify-center">
                    <BarChart
                        dataset={isLoadingSalesData ? [] : formattedSalesData}
                        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                        series={[
                            { dataKey: 'UNIQUE_FLOWER_ARRANGEMENTS', label: 'Virágcsokrok', color: '#8884d8' },
                            { dataKey: 'DRY_PLANT_MOSS_ART', label: 'Száraz zuzmókép', color: '#82ca9d' },
                            { dataKey: 'UNIQUE_WIRE_JEWELRY', label: 'Drótékszerek', color: '#ffc658' },
                        ]}
                        {...chartSetting}
                    />
                </div>
                <div className="border p-2 rounded-lg h-60 shadow-md flex items-center justify-center">
                    <PieChart
                        series={[
                            {
                                data: totalSales
                                    ? [
                                        { id: 0, value: totalSales.UNIQUE_FLOWER_ARRANGEMENTS, label: "Virágcsokrok" },
                                        { id: 1, value: totalSales.DRY_PLANT_MOSS_ART, label: "Száraz zuzmóképek" },
                                        { id: 2, value: totalSales.UNIQUE_WIRE_JEWELRY, label: "Drótékszerek" },
                                    ]
                                    : [],
                            },
                        ]}
                        width={500}
                        height={200}
                    />
                </div>
            </div>

            <div className="border p-6 rounded-lg shadow-md mt-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg text-gray-600 font-semibold">Legutóbbi vásárlások</h3>
                    <button
                        className="text-sm text-gray-600 flex items-center"
                        onClick={() => setShowAllOrders(!showAllOrders)}
                    >
                        {showAllOrders ? "Mutass kevesebbet" : "Mutass többet"}
                        {showAllOrders ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                    </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="text-gray-400 text-sm">
                                <th className="py-2 cursor-pointer" onClick={() => handleSort("id")}>Termék azonosító</th>
                                <th className="py-2 cursor-pointer" onClick={() => handleSort("userEmail")}>Vásárló email címe</th>
                                <th className="py-2 cursor-pointer" onClick={() => handleSort("totalAmount")}>Teljes összeg</th>
                                <th className="py-2 cursor-pointer" onClick={() => handleSort("status")}>Állapot</th>
                                <th className="py-2 cursor-pointer" onClick={() => handleSort("createdAt")}>Dátum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingRecentOrders ? (
                                <tr>
                                    <td colSpan={5} className="py-2 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : sortedOrders.length > 0 ? (
                                sortedOrders.map((order: any, index: number) => (
                                    <tr key={index} className="border-b border-gray-700">
                                        <td className="py-2 text-black">{order.id}</td>
                                        <td className="py-2 text-black">{order.userEmail || "Vendég vásárló"}</td>
                                        <td className="py-2 text-black">{order.totalAmount.toLocaleString()} Ft</td>
                                        <td className={`py-2 text-black font-semibold ${
                                            order.status === "COMPLETED" ? "text-green-400" 
                                            : order.status === "PENDING" ? "text-yellow-400" 
                                            : "text-red-400"
                                        }`}>
                                            {order.status}
                                        </td>
                                        <td className="py-2 text-black">
                                            {new Date(order.createdAt).toLocaleString("hu-HU", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-2 text-center text-gray-500">Nincsenek vásárlások</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;