import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PasswordCriteriaDialog from './PasswordCriteriaDialog';

const Signup = () => {
    const [data, setData] = useState({ fullName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [isPasswordCriteriaOpen, setIsPasswordCriteriaOpen] = useState(false);
    const navigate = useNavigate();

    const handleChange = ({ target }) => {
        setData({ ...data, [target.name]: target.value });
    };

    const handlePasswordChange = (e) => {
        handleChange(e); // Update the data state with the new password value
        setIsPasswordCriteriaOpen(true); // Open the password criteria dialog
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = 'http://localhost:4000/api/users';
            const { data: res } = await axios.post(url, data);
            setSignupSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    const handleClosePasswordCriteria = () => {
        setIsPasswordCriteriaOpen(false); // Close the password criteria dialog
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
                                            <input type="text" name="fullName" className="form-control form-control-lg" placeholder="Enter your Full Name" onChange={handleChange} value={data.fullName} required />
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
                                            <input type="password" name="password" className="form-control form-control-lg" placeholder="Enter your password" onChange={handlePasswordChange} value={data.password} required />
                                        </div>
                                    </div>
                                    {error && <div name="error-alert" className="form-outline mb-4 text-danger">{error}</div>}
                                    {signupSuccess && (
                                        <div className="alert alert-success" id="success_alert" role="alert" value="Signup successful! Redirecting to SignIn page...">
                                            Signup successful! Redirecting to SignIn page...
                                        </div>
                                    )}
                                    <hr className="mx-n3" />
                                    <div className="px-5 py-4">
                                        <button type="submit"  name="submit" className="btn btn-primary btn-lg">Sign Up</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Render the PasswordCriteriaDialog component */}
            <PasswordCriteriaDialog isOpen={isPasswordCriteriaOpen} onClose={handleClosePasswordCriteria} password={data.password} />
        </section>
    );
};

export default Signup;
