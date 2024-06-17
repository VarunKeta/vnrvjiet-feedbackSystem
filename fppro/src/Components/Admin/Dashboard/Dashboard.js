import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const { typeOfStakeholder } = location.state || {};
  let url;

  if(typeOfStakeholder === 'Alumni'){
    url = 'http://localhost:5000/alumini-api/get-form-response-stats';
  } else if(typeOfStakeholder === 'Faculty'){
    url = 'http://localhost:5000/faculty-api/get-form-response-stats';
  } else if(typeOfStakeholder === 'Student_theory'){
    url = 'http://localhost:5000/student-api/get-form-response-stats-theory';
  }else if(typeOfStakeholder === 'Student_laboratory'){
      url = 'http://localhost:5000/student-api/get-form-response-stats-laboratory';
  } else if(typeOfStakeholder === 'Graduate_exit_institution'){
    url = 'http://localhost:5000/graduate-api/get-form-response-stats-institution';
  } else if(typeOfStakeholder === 'Graduate_exit_department'){
    url = 'http://localhost:5000/graduate-api/get-form-response-stats-department';
  } else if(typeOfStakeholder === 'Industry'){
    url = 'http://localhost:5000/industry-api/get-form-response-stats';
  } else if(typeOfStakeholder === 'Professional'){
    url = 'http://localhost:5000/professional-api/get-form-response-stats';
  } else if(typeOfStakeholder === 'Parent'){
    url = 'http://localhost:5000/parent-api/get-form-response-stats';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const axiosWithToken = axios.create({
          headers: { Authorization: `Bearer ${token}` }
        });
        const response = await axiosWithToken.get(url);
        setFormStats(response.data);
      } catch (error) {
        console.error('Error fetching form response stats:', error);
      }
    };

    fetchData();
  }, [url]);

  const prepareChartData = () => {
    if (!formStats) return { labels: [], datasets: [] };

    const filteredQuestions = formStats.questions.filter(
      question => question.qtype === 1 || question.qtype === 2 || question.qtype === 4
    );

    const labels = filteredQuestions.map(question => question.text);
    const optionCounts = {};
    filteredQuestions.forEach(question => {
      Object.entries(question.counts).forEach(([option, count]) => {
        if (!optionCounts[option]) {
          optionCounts[option] = Array(filteredQuestions.length).fill(0);
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
      <h2>{typeOfStakeholder}</h2>
      {formStats ? (
        <Bar
          data={prepareChartData()}
          options={{
            scales: {
              x: {
                stacked: false,
              },
              y: {
                stacked: false,
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
      <div className="mt-4 text-center">
        <button className="btn btn-secondary" onClick={() => navigate('/admin-profile/piecharts', { state: { typeOfStakeholder } })}>
          Choose question
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
