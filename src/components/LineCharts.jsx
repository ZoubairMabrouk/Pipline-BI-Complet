import axios from "axios";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Linechart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5030/api/Mdx/employee")
      .then((res) =>{ setData(res.data);console.log(res.data);})
      .catch((err) => console.error("Erreur de chargement", err));
      
  }, []);

  const formattedData = data.map((item) => ({
    year: item["[Order Date].[yq].[Quarter].[MEMBER_CAPTION]"],
    employeeCount: item["[Measures].[Employee]"]
  }));

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md w-full max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        📊 Evolution of the number of Employees
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="employeeCount" stroke="#2563EB" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Linechart;
