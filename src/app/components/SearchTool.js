'use client'

import React, { useState, useEffect } from 'react';
import moment from 'moment';

const SearchTool = () => {
  const [isLoading, setLoading] = useState(true);
  const [prices, setPrices] = useState([]);
  const [searchedDate, setSearchedDate] = useState(null);
  const [searchedPrice, setSearchedPrice] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const LATEST_PRICES_ENDPOINT = '/api/latest-prices.json';
      try {
        const response = await fetch(LATEST_PRICES_ENDPOINT);
        const data = await response.json();
        setPrices(data.prices);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriceForDate = (date) => {
    const matchingPriceEntry = prices.find(
      (price) => new Date(price.startDate) <= date && new Date(price.endDate) > date
    );
    if (!matchingPriceEntry) {
      throw 'Price for the requested date is missing';
    }
    return matchingPriceEntry.price;
  };

  const handleSearch = (event) => {
    event.preventDefault();
    try {
      const selectedDate = new Date(searchedDate);

      const now = moment();
      const pricesAvailable = now.hour() >= 14;
      if(pricesAvailable){
        setMessage('The price: ')
        setSearchedPrice(null);
      } else  {
        setMessage('Check the price for tomorrow after 14:00');
      }
       

      const price = getPriceForDate(selectedDate);
      
      setSearchedPrice(price);
    } catch (e) {
      console.error(`Failed, because: ${e}`);
    }
  };

  return (
    <div>
      
      <form onSubmit={handleSearch}>
        <br></br>
        <p>You can search for a price of a certain hour. </p>
        <p>Prices are available only for the current 48 hours.</p>
        <label find="search">The searched time:</label><br />
        <input
          type="datetime-local"
          id="search"
          name="search"
          value={searchedDate}
          onChange={(e) => setSearchedDate(e.target.value)}
        /><br />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Search
        </button>
      </form>
      {searchedPrice !== null ? (
        <p>Searched price: {searchedPrice.toFixed(2)} snt / kWh (sis. alv)</p>
      ) : message && (
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
};

export default SearchTool;
