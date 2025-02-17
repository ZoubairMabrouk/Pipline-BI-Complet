import axios from 'axios';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

function SalesTerritory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5030/api/Mdx/SalesTerrority")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erreur de chargement", err));
  }, []);

  // Structure the data into a format compatible with Recharts
  const chartData = data.map(item => ({
    year: item['[Due Date].[yq].[Year].[MEMBER_CAPTION]'].split('-')[0], // Extract year
    territory: item['[Territory].[Territory].[Territory].[MEMBER_CAPTION]'],
    totalSales: parseFloat(item['[Measures].[LineTotal-Sales]']/1000),
  }));

  // Aggregate data to have total sales per territory per year
  const aggregatedData = [];
  chartData.forEach(item => {
    const existingTerritory = aggregatedData.find(entry => entry.territory === item.territory);
    if (existingTerritory) {
      existingTerritory[item.year] = item.totalSales;
    } else {
      aggregatedData.push({ territory: item.territory, [item.year]: item.totalSales });
    }
  });

  // Prepare the data for each year
  const years = [...new Set(chartData.map(item => item.year))];

  return (
    <div className="container mx-auto p-10 justify-center">
      <h1 className="text-3xl font-bold text-center mb-6">Sales per Territory per Year</h1>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="territory" />
            <YAxis />
            <Tooltip
              formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)}
              labelFormatter={(label) => `Territoire: ${label}`}
            />
            <Legend />
            {years.map((year, index) => (
              <Bar
                key={year}
                dataKey={year}
                fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
                name={`Sales for ${year}`}
              >
                {aggregatedData.map((entry, idx) => (
                  <Cell key={idx} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesTerritory;
