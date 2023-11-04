import React, {useState} from "react";
export const Login=(props) => { 
    const[Username,setUsername ]=useState('');
    const[Password,setPassword]=useState('');
    
    const handleSubmit=(e)=>{
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
        fetch("http://localhost:4000/api/login", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then(data => {
                // Saving userID in local storage
                localStorage.setItem('userId', data.user.ID);
                props.onFormSwitch('todo');
                
            })
            .catch(error => {
                console.error('Error:', error); // Handle any potential errors
                alert(`Error: ${error.message}`); // Show the API error message in an alert
                // You can also display the error message in the UI or handle it differently

            });
    }
    return( 
      <div className="auth-form-container">
<h1>Task Board</h1>
        <h2>Login</h2>
 <form className="login-form" onSubmit={handleSubmit}>
    <label htmlFor="Username">Username</label>
    <input value={Username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Enter your Username " id="Username" name="Username"/>
    <label htmlFor="Password">Password</label>
    <input value={Password} onChange={(e)=>setPassword(e.target.value)} type="Password" placeholder="Enter your Password " id="Password" name="Password"/>
    <button type="submit">Log In</button>
 </form>
 <button className="link-btn" onClick={()=>props.onFormSwitch('register')}>Dont have an account? Register here.</button>
</div>
    )
} 