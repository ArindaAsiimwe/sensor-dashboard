import React from 'react';

function SensorItem({ sensor }) {
  const date = new Date(sensor.timestamp * 1000).toLocaleString();
  
  return (
    <div className="sensor-item">
      <h3>Device: {sensor.device_id}</h3>
      <p>Time: {date}</p>
      <div className="sensor-readings">
        {sensor.temperature && <p>Temperature: {sensor.temperature}°C</p>}
        {sensor.humidity && <p>Humidity: {sensor.humidity}%</p>}
        {sensor.battery_voltage && <p>Battery: {sensor.battery_voltage}V</p>}
        {sensor.move_count && <p>Movements: {sensor.move_count}</p>}
        {sensor.field_2 && <p>Field 2: {sensor.field_2}</p>}
      </div>
    </div>
  );
}

export default SensorItem;