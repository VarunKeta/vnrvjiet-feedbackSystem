import React, { useState } from 'react';
import { Button, Form, Container, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function CreateForm() {
    const [formTitle, setFormTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('1');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [message, setMessage] = useState('');
    const [userType, setUserType] = useState(''); // New state for user type

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
        const createdForm = { title: formTitle, questions };
        const token = localStorage.getItem('token');
        
        const axiosWithToken = axios.create({
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!formTitle || questions.length === 0) {
            alert('Please provide a form title and at least one question.');
            return;
        }
        if (!userType) {
            alert('Please select a user type.');
            return;
        }

        const apiUrlMap = {
            'Student': 'http://localhost:5000/student-api/create-form',
            'Alumni': 'http://localhost:5000/admin-api/create-form',
            'Faculty': 'http://localhost:5000/faculty-api/create-form'
        };

        const apiUrl = apiUrlMap[userType];

        try {
            const response = await axiosWithToken.post(apiUrl, createdForm);
            if (response.status === 201) {
                setFormSubmitted(true);
                setTimeout(() => {
                    resetForm();
                }, 3000); // Reset form after 3 seconds
            } else {
                alert(response.data.message || 'Failed to create the form');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 401) {
                setMessage('Unauthorized access. Please login to continue');
            } else {
                setMessage('Error creating form');
            }
            alert(error.message);
        }
    };

    if (formSubmitted) {
        return (
            <Container className='container card shadow p-3'>
                <h1>Your form has been created successfully!</h1>
                <Button onClick={resetForm} variant="primary">Create Another Form</Button>
            </Container>
        );
    }

    return (
        <Container className='container card shadow p-5'>
            <h1 className="mb-3">Create Form</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="userType">
                    <Form.Label className='fw-bold'>Select User Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="Student">Student</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Graduate_exit">Graduate Exit</option>
                        <option value="Parent">Parent</option>
                        <option value="Professional">Professional body</option>
                        <option value="Industry">Industry</option>

                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formTitle">
                    <Form.Label className='fw-bold mt-2'>Form Title</Form.Label>
                    <Form.Control
                        as="select"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                    >
                        <option value="">Select Form Type</option>
                        <option value="Student form">Student Form</option>
                        <option value="Alumni form">Alumni Form</option>
                        <option value="Faculty form">Faculty Form</option>
                        <option value="Graduate form">Graduate Exit Form</option>
                        <option value="Parent form">Parent Form</option>
                        <option value="Professional form">Professional Body Form</option>
                        <option value="Industry form">Industry Form</option>

                    </Form.Control>
                   
                </Form.Group>
                <Button variant="primary" onClick={() => setIsAddingQuestion(true)} className="mt-3">
                    Add Question
                </Button>
                {isAddingQuestion && (
                    <div className="my-3">
                        <Form.Group controlId="questionText">
                            <Form.Label>Question Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="questionType">
                            <Form.Label>Question Type</Form.Label>
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
                            className="mt-2 ml-2"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                <Button type="submit" variant="primary" className="mt-3 ms-3">
                    Create Form
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

export default CreateForm;
