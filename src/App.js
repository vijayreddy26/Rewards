import React, { useState, useEffect } from 'react';

const calculatePoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2;
    amount = 100;
  }
  if (amount > 50) {
    points += (amount - 50) * 1;
  }
  return points;
};

const App = () => {
  const [data, setData] = useState([]);
  const [rewards, setRewards] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/customers.json');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching the customer data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateRewards = () => {
      const rewardsSummary = {};

      data.forEach(customer => {
        let customerRewards = {};

        customer.transactions.forEach(transaction => {
          const month = new Date(transaction.date).getMonth() + 1; // getMonth is 0-indexed
          const points = calculatePoints(transaction.amount);

          if (!customerRewards[month]) {
            customerRewards[month] = 0;
          }
          customerRewards[month] += points;
        });

        const totalPoints = Object.values(customerRewards).reduce((acc, val) => acc + val, 0);
        customerRewards.total = totalPoints;

        rewardsSummary[customer.customerId] = {
          name: customer.name,
          ...customerRewards,
        };
      });

      setRewards(rewardsSummary);
    };

    if (data.length > 0) {
      calculateRewards();
    }
  }, [data]);

  return (
    <div>
      <h1>Customer Reward Points</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Customer</th>
            <th>July</th>
            <th>August</th>
            <th>September</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rewards).map(([customerId, rewardData]) => (
            <tr key={customerId}>
              <td>{rewardData.name}</td>
              <td>{rewardData[7] || 0}</td>
              <td>{rewardData[8] || 0}</td>
              <td>{rewardData[9] || 0}</td>
              <td>{rewardData.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
