/* eslint-disable react-hooks/exhaustive-deps */
import '../App.css';
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listSensorsData } from '../graphql/queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';

// Format timestamp for x-axis
function formatTimestamp(ts) {
  return ts ? new Date(ts).toLocaleTimeString() : "Invalid";
}

function SensorDashboard() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("all"); // all, 24h, 1h, 7d
  const client = generateClient();

  useEffect(() => {
    fetchSensors();
    // Set up interval to refresh data every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchSensors();
    }, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [timeRange]);

  function getTimeRangeLabel(value) {
    switch (value) {
      case "1h": return "Last 1 Hour";
      case "24h": return "Last 24 Hours";
      case "7d": return "Last 7 Days";
      default: return "All Time";
    }
  }

  async function fetchSensors() {
    try {
      let allItems = [];
      let nextToken = null;

      do {
        const result = await client.graphql({
          query: listSensorsData,
          variables: {
            limit: 1000,
            nextToken,
          },
        });

        const { items, nextToken: newToken } = result.data.listSensorsData;
        allItems = [...allItems, ...items];
        nextToken = newToken;
      } while (nextToken);

      allItems = allItems
        .filter(item => item.received_at)
        .map(item => ({
          ...item,
          timestamp: new Date(item.received_at).getTime(),
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      const now = Date.now();
      const filtered = allItems.filter(item => {
        if (timeRange === "1h") return now - item.timestamp <= 3600000;
        if (timeRange === "24h") return now - item.timestamp <= 86400000;
        if (timeRange === "7d") return now - item.timestamp <= 604800000;
        return true;
      });

      setSensors(filtered);
      setLoading(false);
      console.log("Fetched sensor data:", filtered.length, "items");
    } catch (err) {
      console.error('Error fetching sensors:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  if (loading) return <div>Loading sensors...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  // Stats
  const tempVals = sensors.map(s => s.temperature).filter(v => v != null);
  const humidVals = sensors.map(s => s.humidity).filter(v => v != null);
  const batteryVals = sensors.map(s => s.battery_voltage).filter(v => v != null);

  const COLORS = ['#FF8042', '#00C49F', '#0088FE'];

  // Group temperature ranges
  const tempGroups = [
    { name: "< 15°C", value: sensors.filter(s => s.temperature < 15).length },
    { name: "15°C - 25°C", value: sensors.filter(s => s.temperature >= 15 && s.temperature <= 25).length },
    { name: "> 25°C", value: sensors.filter(s => s.temperature > 25).length },
  ];

  // Group humidity
  const humidityGroups = [
    { name: "< 30%", value: sensors.filter(s => s.humidity < 30).length },
    { name: "30% - 60%", value: sensors.filter(s => s.humidity >= 30 && s.humidity <= 60).length },
    { name: "> 60%", value: sensors.filter(s => s.humidity > 60).length },
  ];

  // Group battery voltage
  const batteryGroups = [
    { name: "< 3.0V", value: sensors.filter(s => s.battery_voltage < 3.0).length },
    { name: "3.0 - 3.5V", value: sensors.filter(s => s.battery_voltage >= 3.0 && s.battery_voltage <= 3.5).length },
    { name: "> 3.5V", value: sensors.filter(s => s.battery_voltage > 3.5).length },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Sensor Dashboard</h1>

      <div className="summary">
        <h2 className="text-lg font-medium">Summary</h2>
        <p> Showing <strong>{sensors.length}</strong> data points ({getTimeRangeLabel(timeRange)}) </p>
        <p>Temperature: {Math.min(...tempVals)}°C to {Math.max(...tempVals)}°C</p>
        <p>Humidity: {Math.min(...humidVals)}% to {Math.max(...humidVals)}%</p>
        <p>Avg Battery Voltage: {batteryVals.length ? (batteryVals.reduce((a, b) => a + b, 0) / batteryVals.length).toFixed(2) : "N/A"} V</p>
      </div>
      
      <div className="time-range-select">
        <label className="mr-2 font-medium">Time Range:</label>
        <select
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          className="border rounded p-1"
        >
          <option value="all">All</option>
          <option value="24h">Last 24 hours</option>
          <option value="1h">Last 1 hour</option>
          <option value="7d">Last week</option>
        </select>
      </div>

      {/* Organized Charts */}
      <div className="chart-grid">
        <div className="chart-section">
          <h2>Temperature vs Time</h2>
          <div className="area-chart-container">
            <AreaChart width={350} height={250} data={sensors} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp}>
                <Label value="Time" position="insideBottom" offset={-5} />
              </XAxis>
              <YAxis>
                <Label value="Temperature (°C)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip labelFormatter={formatTimestamp} />
              <Area type="monotone" dataKey="temperature" stroke="#ff7300" fill="#ff7300" dot={false} />
            </AreaChart>
          </div>
        </div>

        <div className="chart-section">
          <h2>Humidity vs Time</h2>
          <div className="area-chart-container">
            <AreaChart width={300} height={250} data={sensors} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp}>
                <Label value="Time" position="insideBottom" offset={-5} />
              </XAxis>
              <YAxis>
                <Label value="Humidity (%)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip labelFormatter={formatTimestamp} />
              <Area type="monotone" dataKey="humidity" stroke="#00bfff" fill="#00bfff" dot={false} />
            </AreaChart>
          </div>
        </div>

        <div className="chart-section">
          <h2>Battery Voltage vs Time</h2>
          <div className="area-chart-container">
            <AreaChart width={300} height={250} data={sensors} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp}>
                <Label value="Time" position="insideBottom" offset={-5} />
              </XAxis>
              <YAxis>
                <Label value="Voltage (V)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip labelFormatter={formatTimestamp} />
              <Area type="monotone" dataKey="battery_voltage" stroke="#82ca9d" fill="#82ca9d" dot={false} />
            </AreaChart>
          </div>
        </div>

        <div className="chart-section">
          <h2>All Metrics Over Time</h2>
          <div className="line-chart-container">
            <LineChart width={380} height={250} data={sensors} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp}>
                <Label value="Time" position="insideBottom" offset={-5} />
              </XAxis>
              <YAxis>
                <Label value="Value" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip labelFormatter={formatTimestamp} />
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" dot={false} name="Temperature (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#00bfff" dot={false} name="Humidity (%)" />
              <Line type="monotone" dataKey="battery_voltage" stroke="#82ca9d" dot={false} name="Battery (V)" />
            </LineChart>
          </div>
        </div>
      </div>

      {/* Pie Charts Section */}
      <div className="chart-grid">
        <div className="chart-section pie-chart-wrapper">
          <h3>Temperature Distribution</h3>
          <div className="pie-chart-container">
            <PieChart width={300} height={300}>
              <Pie data={tempGroups} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {tempGroups.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>
        </div>

        <div className="chart-section pie-chart-wrapper">
          <h3>Humidity Distribution</h3>
          <div className="pie-chart-container">
            <PieChart width={300} height={300}>
              <Pie data={humidityGroups} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {humidityGroups.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>
        </div>

        <div className="chart-section pie-chart-wrapper">
          <h3>Battery Voltage Distribution</h3>
          <div className="pie-chart-container">
            <PieChart width={300} height={300}>
              <Pie data={batteryGroups} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {batteryGroups.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SensorDashboard;