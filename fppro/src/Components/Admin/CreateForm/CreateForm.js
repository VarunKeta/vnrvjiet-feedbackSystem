import React, { useState } from 'react';

function CreateForm() {
    const [title, setTitle] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title) {
            setError('Please provide a title for the form.');
            return;
        }
        try {
            const response = await fetch('http://localhost:4000/admin-api/create-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });
            const data = await response.json();
            if (response.ok) {
                setResult(data);
                setError('');
            } else {
                throw new Error(data.message || 'Failed to create the form');
            }
        } catch (err) {
            setError(err.message);
            setResult(null);
        }
    };

    return (
        <div>
            <h1>Create Google Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">
                    Form Title:
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Create Form</button>
            </form>
            {result && (
                <div>
                    <h3>Form Created Successfully</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
            {error && (
                <div style={{ color: 'red' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
}

export default CreateForm;
