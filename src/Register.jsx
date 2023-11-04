import React, { useState, useCallback } from "react";

export const Register = (props) => {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        // Trim input values to check for blank spaces
        const trimmedUsername = Username.trim();
        const trimmedPassword = Password.trim();

        if (trimmedUsername === '' || trimmedPassword === '') {
            // If username or password is empty or contains only spaces, show an error
            alert("Username and Password are required fields");
            return;
        }
        // Prepare the data to be sent
        const formData = {
            username: trimmedUsername,
            password: trimmedPassword
        };
        fetch("http://localhost:4000/api/signup", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Username already registered');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Handle the response data here
                alert('User registered successfully')
                props.onFormSwitch('login')
            })
            .catch(error => {
                console.error('Error:', error); // Handle any potential errors
                alert(`Error: ${error.message}`); // Show the API error message in an alert
                // You can also display the error message in the UI or handle it differently

            });
    }
    return (
        <div className="auth-form-container">
            <h1>Task Board</h1>
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="Username">Username</label>
                <input value={Username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter your Username " id="Username" name="Username" />
                <label htmlFor="Password">Password</label>
                <input value={Password} onChange={(e) => setPassword(e.target.value)} type="Password" placeholder="Enter your Password " id="Password" name="Password" />
                <button type="submit">Register</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
        </div>
    )
} 