// Register.js
//most is identical to login other than a few thngs
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      //POST to django api endpoint (register in this case)
      //fetches from register instead of login
      //formData --> JSON (JSON.stringify)
      //header for telling Django expect a JSON
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      //convert response (the result of sending something) to JSON
      //you want to read the resulting message
      const data = await res.json();

      //successful register 
      if (res.ok) {
        //display message
        setMessage(data.message); // "User registered successfully"
        navigate("/login");
      } else {
        //display error if didn't work
        setMessage('Registration failed: ' + JSON.stringify(data));
      }
    //catch any unexpected error and print that an error occured
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>Already Have an Account? <Link to="/login">Login</Link></p>
      <p>{message}</p>
    </div>
  );
};

export default Register;
