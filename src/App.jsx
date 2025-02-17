import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Linechart from "./components/LineCharts";
import SalesTerrority from "./components/SalesTerrority";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ForecastChart from "./components/Forecasting";

function App() {
  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto ml-64">
        
      <Routes>
        <Route path="/employee" element={<Linechart />} />
        <Route path="/sale" element={<SalesTerrority />} />
        
        <Route path="/" element={<Dashboard/>} />
        <Route path="/forecast" element={<ForecastChart />} />
      </Routes>

      {/* Main Content */}
      
      </div>
      
    </div>
  );
}

export default App;
