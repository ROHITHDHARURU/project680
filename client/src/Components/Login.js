import { useState } from "react";
import axios from "axios";
import React from 'react';



const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:4000/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (

		<form onSubmit={handleSubmit} class="m-5">
       
        <div class="form-outline mb-4 ">
          <label class="form-label" for="form2Example1">Email address</label>
          <input  type="email" name="email" id="form2Example1" value={data.email} class="form-control"  onChange={handleChange} required/>
          
        </div>
      
        
        <div class="form-outline ">
        <label class="form-label" for="form2Example2">Password</label>
          <input type="password" name="password" id="form2Example2"  value={data.password} class="form-control" onChange={handleChange} required/>
          
        </div>

        


      {error && <div class="form-outline mb-4 text-danger">{error}</div>}
 
        
      
         
       
      
       
        <button type="submit" class="btn btn-primary btn-block mt-3">Sign in</button>
      
       
        <div class="text-center">
          <p>Not a member? <a href="/signup">Register</a></p>
        </div>
      </form>
	);
};

export default Login;
