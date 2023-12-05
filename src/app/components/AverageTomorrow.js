'use client'

import React, { useState, useEffect } from 'react';
import moment from 'moment';

export default function AverageTomorrow() {
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
  const average = tomorrowsPrices.reduce((sum, price) => {
    
    return sum + price.price;
  }, 0);
 
  const countAverage = tomorrowsPrices.length ? average / tomorrowsPrices.length : 0;

  return (
    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Average tomorrow:
      </h5>
      {pricesAvailable ? (
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {`${countAverage.toFixed(2)} cents`}
        </p>
      ) : (
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Check average after 14:00
        </p>
      )}
    </div>
  );
}