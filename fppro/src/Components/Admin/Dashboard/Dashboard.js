import React, { useEffect, useState ,useRef} from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const contentRef = useRef(null);
  let url;

  if (typeOfStakeholder === 'Alumni') {
    url = 'http://localhost:5000/alumini-api/get-form-response-stats';
  } else if (typeOfStakeholder === 'Faculty') {
    url = 'http://localhost:5000/faculty-api/get-form-response-stats';
  } else if (typeOfStakeholder === 'Student_theory') {
    url = 'http://localhost:5000/student-api/get-form-response-stats-theory';
  } else if (typeOfStakeholder === 'Student_laboratory') {
    url = 'http://localhost:5000/student-api/get-form-response-stats-laboratory';
  } else if (typeOfStakeholder === 'Graduate_exit_institution') {
    url = 'http://localhost:5000/graduate-api/get-form-response-stats-institution';
  } else if (typeOfStakeholder === 'Graduate_exit_department') {
    url = 'http://localhost:5000/graduate-api/get-form-response-stats-department';
  } else if (typeOfStakeholder === 'Industry') {
    url = 'http://localhost:5000/industry-api/get-form-response-stats';
  } else if (typeOfStakeholder === 'Professional') {
    url = 'http://localhost:5000/professional-api/get-form-response-stats';
  } else if (typeOfStakeholder === 'Parent') {
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
  //common type of questions are not included .
    const labels = filteredQuestions.map(question => question.qid);
    const optionCounts = {};
    filteredQuestions.forEach(question => {
      Object.entries(question.counts).forEach(([option, count]) => {
        if (!optionCounts[option]) {
          optionCounts[option] = Array(filteredQuestions.length).fill(0);
        }
        optionCounts[option][question.qid - 1] = count;
      });
    });

    const colors = [
      '#9f2042', // red
      '#edbcaa', // blue
      '#828a95 ', // green
      '#00097f', // violet
      '#b4a7d6', // violet
    ];

    const borderColors = [
      '#9f2042', // red
      '#edbcaa', // blue
      '#828a95 ', // green
      '#00097f', // violet
      '#b4a7d6', // violet
    ];

    const datasets = Object.entries(optionCounts).map(([option, counts], index) => ({
      label: option,
      data: counts,
      backgroundColor: colors[index % colors.length],
      borderColor: borderColors[index % borderColors.length],
      borderWidth: 1,
    }));

    return { labels, datasets };
  };

  const calculatePercentages = () => {
    if (!formStats) return [];

    return formStats.questions.map(question => {
      const totalResponses = Object.values(question.counts).reduce((acc, count) => acc + count, 0);
      const percentages = Object.entries(question.counts).reduce((acc, [option, count]) => {
        acc[option] = ((count / totalResponses) * 100).toFixed(2);
        return acc;
      }, {});

      return {
        qid: question.qid,
        qtext: question.text,
        ...percentages,
      };
    });
  };
  const handleDownloadPDF = () => {
    const input = contentRef.current;
    const inputWidth = input.offsetWidth;
    const inputHeight = input.offsetHeight;
  
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('landscape');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (inputHeight / inputWidth) * pdfWidth;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report.pdf');
    });
  };
  const tableData = calculatePercentages();
 
  return (
    <div className="container" ref={contentRef}>
      <h2>Form Response Statistics</h2>
      <h2>{typeOfStakeholder}</h2>
     
        {formStats ? (
          <>
           <div className="ms-5 me-5 mb-5 mt-2 p-5" style={{ 'width': '70%' }}>
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
              </div>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th>Question No</th>
                  <th>Question Text</th>
                  {Object.keys(tableData[0]).filter(key => key !== 'qid' && key !== 'qtext').map(option => (
                    <th key={option}>% {option}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map(row => (
                  <tr key={row.qid}>
                    <td>{row.qid}</td>
                    <td>{row.qtext}</td>
                    {Object.keys(row).filter(key => key !== 'qid' && key !== 'qtext').map(option => (
                      <td key={option}>{row[option]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>Loading data...</p>
        )}
        <div className="mt-4 text-center">
          <button className="btn btn-secondary mr-3" onClick={handleDownloadPDF}>
                            Download PDF Report
                      </button>
</div>
        <div className="mt-4 text-center">
          <button className="btn btn-secondary" onClick={() => navigate('/admin-profile/piecharts', { state: { typeOfStakeholder } })}>
            Choose question
          </button>
        </div>
      </div>
 
  );
}

export default Dashboard;
