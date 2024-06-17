import React, { useState, useEffect } from 'react';
import { Button, Form, Container, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowDropdown } from "react-icons/io";

function EditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formTitle, setFormTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('1');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formId, setFormId] = useState(null);
    const [userType, setUserType] = useState(''); // New state for user type
    const [fetchTrigger, setFetchTrigger] = useState(false); // New state for triggering fetch

    useEffect(() => {
        const fetchForm = async () => {
            if (!userType) return; // Don't fetch if user type is not selected

            const token = localStorage.getItem('token');
            const axiosWithToken = axios.create({
                headers: { Authorization: `Bearer ${token}` }
            });

            const apiUrlMap = {
                'Student form (Theory)': 'http://localhost:5000/student-api/get-theory-form',
                'Student form (Laboratory)': 'http://localhost:5000/student-api/get-laboratory-form',
                'Alumni': 'http://localhost:5000/alumini-api/get-form',
                'Faculty': 'http://localhost:5000/faculty-api/get-form',
                'Graduate Exit form (Institution)':'http://localhost:5000/graduate-api/get-institution-form',
                'Graduate Exit form (Department)':'http://localhost:5000/graduate-api/get-department-form',
                'Industry': 'http://localhost:5000/industry-api/get-form',
                'Professional':'http://localhost:5000/professional-api/get-form',
            };

            const apiUrl = apiUrlMap[userType];

            try {
                const response = await axiosWithToken.get(apiUrl);
                if (response.status === 200) {
                    const data = response.data;
                    setFormTitle(data.title);
                    setQuestions(data.questions);
                    setFormId(data._id);
                } else {
                    alert(response.data.message);
                }
            } catch (err) {
                alert(err.message);
            }
        };

        fetchForm();
    }, [fetchTrigger, userType]);

    const resetForm = () => {
        setFormTitle('');
        setQuestions([]);
        setQuestionText('');
        setQuestionType('1');
        setIsAddingQuestion(false);
        setEditingIndex(null);
        setFormSubmitted(false);
    };

    const handleAddOrEditQuestion = () => {
        const newQuestion = {
            qid: editingIndex !== null ? questions[editingIndex].qid : questions.length + 1,  // Preserve or assign qid
            text: questionText,
            qtype: parseInt(questionType),
            references: []
        };

        if (editingIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingIndex] = newQuestion;
            setQuestions(updatedQuestions);
            setEditingIndex(null);
        } else {
            setQuestions([...questions, newQuestion]);
        }

        setQuestionText('');
        setQuestionType('1');
        setIsAddingQuestion(false);
    };

    const handleEditQuestion = (index) => {
        setQuestionText(questions[index].text);
        setQuestionType(questions[index].qtype.toString());
        setEditingIndex(index);
        setIsAddingQuestion(true);
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formTitle, questions);
        console.log(formId);
        if (!formTitle || questions.length === 0) {
            alert('Please provide a form title and at least one question.');
            return;
        }
        if (!userType) {
            alert('Please select a user type.');
            return;
        }

        const token = localStorage.getItem('token');
        const axiosWithToken = axios.create({
            headers: { Authorization: `Bearer ${token}` }
        });

      

        const apiUrl = 'http://localhost:5000/admin-api/update-form';

        try {
            const response = await axiosWithToken.put(apiUrl, {
                title: formTitle,
                questions
            });
            if (response.status === 200) {
                setFormSubmitted(true);
                setTimeout(() => {
                    resetForm();
                }, 3000); // Reset form after 3 seconds
            } else {
                alert(response.data.message || 'Failed to update the form');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            console.error('Response:', err.response);
            alert(err.message);
        }
    };

    if (formSubmitted) {
        return (
            <Container className='container card shadow p-3'>
                <h1>Your form has been updated successfully!</h1>
                <Button onClick={resetForm} variant="primary">Edit Another Form</Button>
            </Container>
        );
    }

    return (
        <Container className='container card shadow p-5'>
            <h1 className="mb-3">Edit Form</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="userType">
                    <Form.Label className='fw-bold'>Select User Type </Form.Label>
                    <Form.Control
                        as="select"
                        value={userType}
                        onChange={(e) => {
                            setUserType(e.target.value);
                            setFetchTrigger(prev => !prev); // Trigger fetch
                        }}
                        required
                    >
                      <option value="">Select User Type</option>
                        <option value="Student form (Theory)">Student form (Theory)</option>
                        <option value="Student form (Laboratory)">Student form (Laboratory)</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Graduate Exit form (Institution)">Graduate Exit form (Institution)</option>
                        <option value="Graduate Exit form (Department)">Graduate Exit form (Department)</option>
                        <option value="Parent">Parent</option>
                        <option value="Professional">Professional body</option>
                        <option value="Industry">Industry</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formTitle">
                    <Form.Label className='fw-bold mt-1'>Form Title</Form.Label>
                   <Form.Control
                    as="select"
                    value={formTitle}
                    onChange={(e) => {
                        setFormTitle(e.target.value);
                     
                    }}
                    required

                >
                    <option value="">Select Form Type</option>
                        <option value="Student form (Theory)">Student form (Theory)</option>
                        <option value="Student form (Laboratory)">Student form (Laboratory)</option>
                        <option value="Alumni form">Alumni Form</option>
                        <option value="Faculty form">Faculty Form</option>
                        <option value="Graduate Exit form (Institution)">Graduate Exit form (Institution)</option>
                        <option value="Graduate Exit form (Department)">Graduate Exit form (Department)</option>
                        <option value="Parent form">Parent Form</option>
                        <option value="Professional form">Professional Body Form</option>
                        <option value="Industry form">Industry Form</option>
                </Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={() => setIsAddingQuestion(true)} className="mt-3 me-1">
                    Add Question
                </Button>
                {isAddingQuestion && (
                    <div className="my-3">
                        <Form.Group controlId="questionText">
                            <Form.Label className='fw-bold'>Question Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="questionType">
                            <Form.Label className='fw-bold '>Question Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={questionType}
                                onChange={(e) => setQuestionType(e.target.value)}
                            >
                                <option value="1">1-5 options</option>
                                <option value="2">Yes/No</option>
                                <option value="3">Comment type</option>
                                <option value="4">Excellent to Poor</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="success" onClick={handleAddOrEditQuestion} className="mt-2">
                            {editingIndex !== null ? 'Edit Question' : 'Add Question'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setQuestionText('');
                                setQuestionType('1');
                                setIsAddingQuestion(false);
                                setEditingIndex(null);
                            }}
                            className="mt-2 ms-2"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                <Button type="submit" variant="primary" className="mt-3">
                    Update Form
                </Button>
            </Form>
            <h3 className="my-4">Questions</h3>
            <ListGroup>
                {questions.map((q, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <span>
                            {q.text} ({['1-5 options', 'Yes/No', 'Comment type', 'Excellent to Poor'][q.qtype - 1]})
                        </span>
                        <div>
                            <Button variant="warning" onClick={() => handleEditQuestion(index)} className="mr-2">
                                Edit
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteQuestion(index)}>
                                Delete
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default EditForm;
