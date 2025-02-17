import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const ForecastChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1️⃣ Récupérer les données de ventes hebdomadaires depuis le backend .NET
                const { data: history } = await axios.get("http://localhost:5030/api/Mdx/forcast");

                // 2️⃣ Envoyer ces données à l'API de prédiction
                const { data: forecastData } = await axios.post("http://127.0.0.1:8000/forecast", { values: history });

                // 3️⃣ Préparer les données historiques par trimestre
                const historicalLabels = forecastData.historical.map(d => d.quarter);
                const historicalDataset = {
                    label: "Historical Sales",
                    data: forecastData.historical.map(d => d.y),
                    borderColor: "blue",
                    fill: false
                };

                // 4️⃣ Préparer les données de prévision par trimestre
                const forecastLabels = forecastData.quarterly_forecast.map(d => d.ds);
                const forecastDataset = {
                    label: "Quarterly Sales Forecast",
                    data: forecastData.quarterly_forecast.map(d => d.yhat),
                    borderColor: "red",
                    fill: false,
                    borderDash: [5, 5]
                };

                //console.log(...historicalLabels);
                setChartData({
                    labels: [...forecastLabels],
                    datasets: [historicalDataset, forecastDataset],
                });
            } catch (error) {
                console.error("Error fetching forecast data:", error);
            }
        };

        fetchData();

    }, []);

    return chartData ? <Line data={chartData} /> : <p>Loading...</p>;
};

export default ForecastChart;
