import React, { useState, useEffect } from 'react';

const PasswordCriteriaDialog = ({ isOpen, onClose, password }) => {
    const [criteriaMet, setCriteriaMet] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialCharacter: false
    });
    const [allCriteriaMet, setAllCriteriaMet] = useState(false);

    useEffect(() => {
        checkPasswordStrength(password);
    }, [password]);

    useEffect(() => {
        // Check if all criteria are met
        const allMet = Object.values(criteriaMet).every(value => value);
        setAllCriteriaMet(allMet);

        // Close the dialog if all criteria are met
        if (allMet) {
            onClose();
        }
    }, [criteriaMet, onClose]);

    const handleClose = () => {
        onClose();
    };

    const checkPasswordStrength = (password) => {
        setCriteriaMet({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialCharacter: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        });
    };

    return (
        <div className={`password-criteria-dialog ${isOpen ? 'open' : ''}`}>
            <div className="password-criteria-dialog-content">
                <h2>Password Criteria</h2>
                <ul>
                    <li>
                        <input type="checkbox" checked={criteriaMet.minLength} disabled />
                        <label className={criteriaMet.minLength ? 'green' : ''}>Minimum length: 8 characters</label>
                    </li>
                    <li>
                        <input type="checkbox" checked={criteriaMet.hasUppercase} disabled />
                        <label className={criteriaMet.hasUppercase ? 'green' : ''}>Must contain at least one uppercase letter</label>
                    </li>
                    <li>
                        <input type="checkbox" checked={criteriaMet.hasLowercase} disabled />
                        <label className={criteriaMet.hasLowercase ? 'green' : ''}>Must contain at least one lowercase letter</label>
                    </li>
                    <li>
                        <input type="checkbox" checked={criteriaMet.hasNumber} disabled />
                        <label className={criteriaMet.hasNumber ? 'green' : ''}>Must contain at least one number</label>
                    </li>
                    <li>
                        <input type="checkbox" checked={criteriaMet.hasSpecialCharacter} disabled />
                        <label className={criteriaMet.hasSpecialCharacter ? 'green' : ''}>Must contain a special character</label>
                    </li>
                </ul>
                <button onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default PasswordCriteriaDialog;
