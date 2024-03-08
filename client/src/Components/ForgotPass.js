import React, { useState } from "react";
import axios from "axios";

const ForgotPass = () => {
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const handleChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true
        try {
            const url = "http://localhost:4000/api/forgot-password";
            const { data } = await axios.post(url, formData);
            setSuccessMessage(data.message);
            setError("");
            setFormData({
                email: "",
                newPassword: "",
                confirmNewPassword: "",
            });
            // Simulate redirection after 3 seconds
            setTimeout(() => {
                setRedirecting(true);
            }, 2000);
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    if (redirecting) {
        // Redirect to login page after 3 seconds
        setTimeout(() => {
            window.location.href = "/login"; // Redirect to login page
        }, 2000);
    }

    return (
        <div>
            <h3>Reset Password</h3>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <div className="alert alert-info">Please wait...</div>}
            {redirecting && (
                <div className="alert alert-info">Redirecting to login page...</div>
            )}
            {!redirecting && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="form-control"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            className="form-control"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                </form>
            )}
        </div>
    );
};

export default ForgotPass;
