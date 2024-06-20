import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

function Dashboard() {
  const [formStats, setFormStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const axiosWithToken = axios.create({
          headers: { Authorization: `Bearer ${token}` }
        });
        const response = await axiosWithToken.get('http://localhost:5000/alumini-api/get-form-response-stats');
        setFormStats(response.data);
      } catch (error) {
        console.error('Error fetching form response stats:', error);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = () => {
    if (!formStats) return { labels: [], datasets: [] };

    const labels = formStats.questions.map(question => question.text);
    const optionCounts = {};
    formStats.questions.forEach(question => {
      Object.entries(question.counts).forEach(([option, count]) => {
        if (!optionCounts[option]) {
          optionCounts[option] = Array(formStats.questions.length).fill(0);
        }
        optionCounts[option][question.qid - 1] = count;
      });
    });

    const datasets = Object.entries(optionCounts).map(([option, counts], index) => ({
      label: option,
      data: counts,
      backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.6)`,
      borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
      borderWidth: 1,
    }));

    return { labels, datasets };
  };

  return (
    <div className="container">
      <h2>Form Response Statistics</h2>
      {formStats ? (
        <Bar
          data={prepareChartData()}
          options={{
            scales: {
              x: {
                stacked: false, // Display bars side by side on the x-axis
              },
              y: {
                stacked: false, // Display bars side by side on the y-axis
                beginAtZero: true,
                ticks: {
                  precision: 0, // Ensure y-axis labels are integers only
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
      <div className="mt-4 text-center">
        <button className="btn btn-secondary" onClick={() => navigate('/admin-profile/piecharts')}>
          Choose question
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
