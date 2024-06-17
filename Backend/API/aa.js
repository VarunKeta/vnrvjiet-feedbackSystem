import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function PieCharts() {
  const [formStats, setFormStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const axiosWithToken = axios.create({
          headers: { Authorization: `Bearer ${token}` }
        });
        const response = await axiosWithToken.get('http://localhost:5000/faculty-api/get-form-response-stats');
        setFormStats(response.data);
      } catch (error) {
        console.error('Error fetching form response stats:', error);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = () => {
    if (!formStats) return { labels: [], datasets: [] };

    const question = formStats.questions[0]; // Assuming you want to show the first question
    const labels = Object.keys(question.counts).map(option => `${option}`);
    const counts = Object.values(question.counts);

    return {
      labels,
      datasets: [{
        label: question.text,
        data: counts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }],
    };
  };

  return (
    <div className="container" style={{ height: '250px' }}> {/* Adjust height here */}
      <h2>Form Response Statistics</h2>
      {formStats ? (
        <Doughnut
          data={prepareChartData()}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Add this option to respect the container's height
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  padding: 10, // Adjust this value to decrease the distance
                }
              },
              title: {
                display: true,
                text: 'Response Distribution for a Question'
              }
            },
            cutout: '50%', // Adjust the hole size if needed
            radius: '50%', // Decrease this value to make the donut smaller
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default PieCharts;
