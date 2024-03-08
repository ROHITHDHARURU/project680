import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [data, setData] = useState({ fullName: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false); // New state to track signup success
    const navigate = useNavigate();

    const handleChange = ({ target }) => {
        setData({ ...data, [target.name]: target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:4000/api/users";
            const { data: res } = await axios.post(url, data);
            setSignupSuccess(true); // Set signup success state to true
            setTimeout(() => {
                navigate("/login"); // Redirect to login page after a brief delay
            }, 3000); // 3000 milliseconds (3 seconds) delay
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <section className="vh-100">
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-9">
                        <form onSubmit={handleSubmit}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row align-items-center pt-4 pb-3">
                                        <div className="col-md-3 ps-5">
                                            <h6 className="mb-0">Full Name</h6>
                                        </div>
                                        <div className="col-md-9 pe-5">
                                            <input type="text" name="fullName" className="form-control form-control-lg" onChange={handleChange} value={data.fullName} required />
                                        </div>
                                    </div>
                                    <div className="row align-items-center pt-4 pb-3">
                                        <div className="col-md-3 ps-5">
                                            <h6 className="mb-0">Email</h6>
                                        </div>
                                        <div className="col-md-9 pe-5">
                                            <input type="email" name="email" className="form-control form-control-lg" placeholder="Enter your Email Id" onChange={handleChange} value={data.email} required />
                                        </div>
                                    </div>
                                    <div className="row align-items-center pt-4 pb-3">
                                        <div className="col-md-3 ps-5">
                                            <h6 className="mb-0">Password</h6>
                                        </div>
                                        <div className="col-md-9 pe-5">
                                            <input type="password" name="password" className="form-control form-control-lg" onChange={handleChange} value={data.password} required />
                                        </div>
                                    </div>
                                    {error && <div className="form-outline mb-4 text-danger">{error}</div>}
                                    {signupSuccess && (
                                        <div className="alert alert-success" role="alert">
                                            Signup successful! Redirecting to login page...
                                        </div>
                                    )}
                                    <hr className="mx-n3" />
                                    <div className="px-5 py-4">
                                        <button type="submit" className="btn btn-primary btn-lg">Sign Up</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
