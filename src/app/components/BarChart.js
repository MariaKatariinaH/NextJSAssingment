'use client'

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

export default function BarChart() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/latest-prices.json')
      .then((res) => res.json())
      .then((responseData) => {
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

 
  if (isLoading) return <p>Loading...</p>;
  if (!data) {
    console.log("No profile data", data)
    return <p>No profile data</p>
  }

  const chartData = {
    labels: data.prices.map((price) =>
    price.startDate),
    datasets: [
      {
        label: 'Prices',
        data: data.prices.map((price) => price.price.toFixed(2)),
        backgroundColor: 'rgba(106, 90, 205, 0.6)',
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time', 
        time: {
          displayFormats: {hour: 'HH:mm'} 
        },
        title: {
          display: true,
          text: 'Hour',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price / cents',
        },
        beginAtZero: true,
      },
      
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: 'auto', minHeight: '400px' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}