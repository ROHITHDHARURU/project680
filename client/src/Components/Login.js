import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = ({ target }) => {
        setData({ ...data, [target.name]: target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:4000/api/auth";
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);
            window.location = "/";
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Sign In</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" name="email" id="email" value={data.email} className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" name="password" id="password" value={data.password} className="form-control" onChange={handleChange} required />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <button type="submit" className="btn btn-primary btn-block mt-4">Sign in</button>
                            </form>
                            <p className="text-center mt-3">Not a member? <a href="/signup">Register</a></p>
							<p className="text-center mt-3">Forgot Password? <a href="/forgot-password">Click Here</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
