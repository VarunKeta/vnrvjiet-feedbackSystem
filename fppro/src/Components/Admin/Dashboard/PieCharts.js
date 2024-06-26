import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Form } from 'react-bootstrap';

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
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const location = useLocation();
  const { typeOfStakeholder } = location.state || {};
  let url;

  if(typeOfStakeholder === 'Alumni'){
    url = 'http://localhost:5000/alumini-api/get-form-response-stats';
  } else if(typeOfStakeholder === 'Faculty'){
    url = 'http://localhost:5000/faculty-api/get-form-response-stats';
  }else if(typeOfStakeholder === 'Student_theory'){
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
        const data = response.data;
        const filtered = data.questions.filter(
          question => question.qtype === 1 || question.qtype === 2 || question.qtype === 4
        );
        setFormStats(data);
        setFilteredQuestions(filtered);
      } catch (error) {
        console.error('Error fetching form response stats:', error);
      }
    };

    fetchData();
  }, [url]);

  const prepareChartData = () => {
    if (!filteredQuestions.length) return { labels: [], datasets: [] };

    const question = filteredQuestions[selectedQuestionIndex];
    const labels = Object.keys(question.counts).map(option => `${option}`);
    const counts = Object.values(question.counts);

    return {
      labels,
      datasets: [{
        label: question.text,
        data: counts,
        backgroundColor: [
         '#9f2042', // red
         '#edbcaa', // blue
         '#828a95 ', // green
         '#00097f', // violet
         '#b4a7d6', // violet
        ],
        borderColor: [
         '#9f2042', // red
      '#edbcaa', // blue
      '#828a95 ', // green
      '#00097f', // violet
      '#b4a7d6', // violet
        ],
        borderWidth: 1,
      }],
    };
  };

  const handleQuestionChange = (event) => {
    setSelectedQuestionIndex(Number(event.target.value));
  };

  return (
    <div className="container" style={{ height: '250px' }}>
      <h2>Form Response Statistics</h2>
      <h2>{typeOfStakeholder}</h2>
      <h4 className="mt-4">Select a question number</h4>
      {filteredQuestions.length > 0 && (
        <Form>
          <Form.Group controlId="questionSelect">
            <Form.Label className="fw-bold">Question Number</Form.Label>
            <Form.Control
              as="select"
              value={selectedQuestionIndex}
              onChange={handleQuestionChange}
            >
              {filteredQuestions.map((question, index) => (
                <option key={question.qid} value={index}>
                  {index + 1}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <h4 className="mt-3">{filteredQuestions[selectedQuestionIndex].text}</h4>
        </Form>
      )}
   
      {filteredQuestions.length > 0 ? (
        <Doughnut
          data={prepareChartData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  padding: 10,
                }
              },
              title: {
                display: true,
                text: 'Response Distribution for a Question'
              }
            },
            cutout: '50%',
            radius: '50%',
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default PieCharts;
