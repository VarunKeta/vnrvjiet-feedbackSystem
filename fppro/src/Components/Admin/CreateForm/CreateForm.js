import React, { useState } from 'react';
import { Button, Form, Container, ListGroup } from 'react-bootstrap';

function CreateForm() {
    const [formTitle, setFormTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('1');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAddingQuestion, setIsAddingParams] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const resetForm = () => {
        setFormTitle('');
        setQuestions([]);
        setQuestionText('');
        setQuestionType('1');
        setIsAddingParams(false);
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
        setIsAddingParams(false);
    };

    const handleEditQuestion = (index) => {
        setQuestionText(questions[index].text);
        setQuestionType(questions[index].qtype.toString());
        setEditingIndex(index);
        setIsAddingParams(true);
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formTitle || questions.length === 0) {
            alert('Please provide a form title and at least one question.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/admin-api/create-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: formTitle, questions })
            });
            const data = await response.json();
            if (response.ok) {
                setFormSubmitted(true);
                setTimeout(() => {
                    resetForm();
                }, 3000); // Reset form after 3 seconds
            } else {
                alert(data.message || 'Failed to create the form');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    if (formSubmitted) {
        return (
            <Container>
                <h1>Your form has been created successfully!</h1>
                <Button onClick={resetForm} variant="primary">Create Another Form</Button>
            </Container>
        );
    }

    return (
        <Container>
            <h1 className="my-4">Create Google Form</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Form Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter form title"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" onClick={() => setIsAddingParams(true)} className="my-3">
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
                                setIsAddingParams(false);
                                setEditingIndex(null);
                            }}
                            className="mt-2 ml-2"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                <Button type="submit" variant="primary" className="mt-3">
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