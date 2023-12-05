'use client'

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';

export default function () {
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
  if (!data || !data.prices || data.prices.length === 0) {
    console.log('No profile data', data);
    return <p>No profile data</p>;
  }

  const now = moment();
  const tomorrow = moment().startOf('day').add(1, 'days');
  const tomorrowsPrices = data.prices.filter((price) =>
    moment(price.startDate).isSame(tomorrow, 'day')
  );

  const pricesAvailable = now.hour() >= 14;

  if(!pricesAvailable){
    return <p>Prices will be available after 14:00.</p>
  }

  const chartData = {
    labels: tomorrowsPrices.map((price) => price.startDate),
    datasets: [
      {
        label: 'Prices',
        data: tomorrowsPrices.map((price) => price.price.toFixed(2)),
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
          min: tomorrow,
          max: tomorrow.endOf('day'),
          displayFormats: {
            day: 'YYYY-MM-DD',
            hour: 'HH:mm',
          },
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
