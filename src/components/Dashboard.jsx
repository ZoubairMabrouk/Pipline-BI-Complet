import axios from "axios";
import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Download,
  Users,
  Activity,
  ShoppingBasket,
  CircleDollarSign,
} from "lucide-react";
import { colors } from "@mui/material";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(null);
  const [totalPurchases, setTotalPurchases] = useState(null);
  const [totalprofit, setTotalProfit] = useState([]);
  const [formattedData, setFormattedData] = useState(null);
  const [topSales, setTopSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await axios.get("http://localhost:5030/api/Mdx/sales");
        setTotalSales(salesRes.data[0]["[Measures].[LineTotal-Sales]"]);

        const purchaseRes = await axios.get(
          "http://localhost:5030/api/Mdx/purchase"
        );
        setTotalPurchases(purchaseRes.data[0]["[Measures].[LineTotal]"]);

        const profit = await axios.get(
          "http://localhost:5030/api/Mdx/totalprofit"
        );
        setTotalProfit(profit.data[0]["[Measures].[Profit]"]);

        const profitRes = await axios.get(
          "http://localhost:5030/api/Mdx/profit"
        );
        console.log("Données reçues :", profitRes.data);

        const labels = profitRes.data.map(
          (item) => item["[Due Date].[yq].[Quarter].[MEMBER_CAPTION]"]
        );
        const profitData = profitRes.data.map(
          (item) => item["[Measures].[Profit]"]
        );
        

        setFormattedData({
          labels: labels,
          datasets: [
            {
              label: "Profit",
              data: profitData,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.5)",
            },
          ],
        });
        const topSalesRes = await axios.get(
          "http://localhost:5030/api/Mdx/topsales"
        );
        const filteredTopSales = topSalesRes.data.filter(
          (item) =>
            item["[Product].[Product].[Product].[MEMBER_CAPTION]"] !== null
        );
        setTopSales(filteredTopSales);
        console.log(topSales);

        setIsLoading(false); // Fin du chargement
      } catch (error) {
        console.error("Erreur de chargement :", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-300 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="bg-blue-700 text-black px-4 py-2 rounded flex items-center gap-2">
          <Download size={20} /> Download Reports
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-3 ">
        <div className="text-green-500">
          <StatBox
            title={Math.floor(totalSales) ?? "Chargement..."}
            subtitle="Total Sales"
            icon={<CircleDollarSign size={28} color="green" />}
          />
        </div>
        <div className="text-red-500">
          <StatBox
            title={Math.floor(totalPurchases) ?? "Chargement..."}
            subtitle={"Total Purchase"}
            icon={<ShoppingBasket size={28} color="red" />}
          />
        </div>
        <div className="text-blue-500">
        <StatBox
          title={Math.floor(totalprofit) ?? "Chargement..."}
          subtitle="Total Profits"
          icon={<Activity size={28} />}
        />
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded col-span-2">
          <h2 className="text-lg font-semibold text-blue-500">
            Quarter Profits
          </h2>
          {isLoading ? (
            <p>Chargement des données...</p>
          ) : formattedData ? (
            <Line data={formattedData}  />
          ) : (
            <p>Aucune donnée disponible</p>
          )}
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg  ">
          <h2 className="text-lg font-bold mb-4 text-green-800">
            Top Sales Product
          </h2>
          {isLoading ? (
            <p className="text-gray-500 animate-pulse">
              Chargement des transactions...
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 h-64 overflow-y-auto">
              {topSales.map((item, index) => (
                <li
                  key={index}
                  className="py-3 flex justify-between items-center hover:bg-gray-100 px-4 rounded transition"
                >
                  <div>
                    <span className="text-black-500 font-bold">
                      {item["[Product].[Product].[Product].[MEMBER_CAPTION]"]}
                    </span>
                  </div>
                  <div className="bg-green-500 text-white p-2 rounded">
                    {`$${Math.floor(item["[Measures].[LineTotal-Sales]"])}`}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ title, subtitle, icon }) => {
  return (
    <div className="bg-white p-4 shadow rounded flex items-center justify-center gap-3">
      <div className="text-blue-600">{icon}</div>
      <div>
        <h3 className="text-xl font-bold ">{title}</h3>
        <p className="text-gray-500 font-bold">{subtitle}</p>
      </div>
    </div>
  );
};

export default Dashboard;
