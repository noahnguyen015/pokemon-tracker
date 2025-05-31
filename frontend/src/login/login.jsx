// Login.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


//login component
const Login = () => {
  const navigate = useNavigate();
  //formData data holds username & password
  //setFormData updates form when user types
  const [formData, setFormData] = useState({ username: '', password: '' });
  //stores status message to show them below form
  const [message, setMessage] = useState('');

  //updates the field when user typing occurs
  const handleChange = e => {
    //e.target.name = username or password
    //spread operator ...formData for preservation of other fields
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //called when form is submitted
  //e.prevent.default stops the page from updating
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      //send POST to django /api/login endpoint
      //converts formData to JSON (w/ json/stringify)
      //content-type: application-json <-- to let Django know it's supposed to receive JSON
      const res = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      //convert response to JSON
      //you want to take the response from sending your login and receiving tokens and data back
      const data = await res.json();

      //if the login was successful
      if (res.ok) {
        console.log(data)
        //save access & refresh JWT tokens in localStorage
        //update message ot show a welcome messge
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        setMessage('Logged in as ' + data.username);
        navigate("/");
      } else {
        //otherwise show error message (400, 401)
        setMessage('Login failed: ' + JSON.stringify(data));
      }
    } catch (error) {
      //grabs any unexpected error & displays
      setMessage('Error: ' + error.message);
    }
  };

  //input fields for username & password
  //submit button
  //message occurs below form
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>New Account? <Link to="/register">Register</Link></p>
      <p>{message}</p>
    </div>
  );
};

export default Login;
