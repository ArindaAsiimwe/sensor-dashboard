import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { onCreateSensorsData } from '../graphql/subscriptions';
import SensorItem from './SensorItem';

function SensorRealtime() {
  const [realtimeSensors, setRealtimeSensors] = useState([]);
  const client = generateClient();

  useEffect(() => {
    const subscription = client.graphql({
      query: onCreateSensorsData
    }).subscribe({
      next: (result) => {
        const newSensor = result.data.onCreateSensorsData;
        setRealtimeSensors(prev => [newSensor, ...prev].slice(0, 10));
      },
      error: (error) => console.error('Subscription error:', error)
    });
    
    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (realtimeSensors.length === 0) {
    return <div>Waiting for new sensor readings...</div>;
  }

  return (
    <div className="realtime-sensors">
      <h2>Real-time Sensor Updates</h2>
      {realtimeSensors.map((sensor) => (
        <SensorItem 
          key={`${sensor.device_id}-${sensor.timestamp}`} 
          sensor={sensor} 
        />
      ))}
    </div>
  );
}

export default SensorRealtime;