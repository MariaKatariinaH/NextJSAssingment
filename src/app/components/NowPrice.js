'use client'

import React, { useState, useEffect } from 'react';

const NowPrice = () => {
  const [isLoading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const PRICE_ENDPOINT = '/api/price.json';

        const dateAndTimeNow = new Date();
        const date = dateAndTimeNow.toISOString().split('T')[0];
        const hour = dateAndTimeNow.getHours();

        const response = await fetch(`${PRICE_ENDPOINT}?date=${date}&hour=${hour}`);
        const { price } = await response.json();

        setCurrentPrice(price);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (currentPrice === null) return <p>No price data</p>;

  return (
    <div>
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Price now:
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {`${currentPrice.toFixed(2)} cents`}
        </p>
      </div>
    </div>
  );
};

export default NowPrice;