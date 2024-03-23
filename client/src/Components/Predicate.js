import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TruthTableGenerator.css';

const TruthTableGenerator = () => {
    const [expression, setExpression] = useState('');
    const [coverageType, setCoverageType] = useState('Predicate Coverage');
    const [truthTable, setTruthTable] = useState('');
    const [error, setError] = useState('');
    const [historyData, setHistoryData] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [hideHistory, setHideHistory] = useState(false);
    const [actionPerformed, setActionPerformed] = useState(false);
    const [succActionPerformed, setSuccActionPerformed]=useState(false)
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setError('');
        fetchHistoryData();
    }, []);

    const fetchHistoryData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Warning!. Please Sign In to save your work!!!');
                return;
            }

            const response = await axios.get('http://localhost:4000/api/history', {
                params: {
                    email: token
                }
            });

            setHistoryData(response.data.predicatesAndCoverageTypes);
        } catch (error) {
            setError('Error fetching history data.');
            console.error('Error fetching history data:', error);
        }
    };

    const generateTruthTable = () => {
        const symbols = [...new Set(expression.match(/[A-Za-z]/g))];

        if (!expression || !coverageType) {
            setError("Please enter an expression and select a coverage type.");
            return;
        }

        try {
            let resultTable = '';
            if (coverageType === "Predicate Coverage") {
                resultTable = generatePredicateCoverage(expression, symbols);
            } else if (coverageType === "Combinatorial Coverage") {
                resultTable = generateCombinatorialCoverage(expression, symbols);
            } else if (coverageType === "Active Clause Coverage") {
                resultTable = generateActiveClauseCoverage(expression, symbols);
            }

            setTruthTable(resultTable);
            setError('');
            setSuccessMessage('');
            setActionPerformed(true);
        } catch (error) {
            console.error('Error:', error);
            setError('Error generating truth table');
            setActionPerformed(true);
        }
    };



const saveData = async () => {
    try {
        const email = localStorage.getItem('token');
        if (!expression) {
            setError('Please enter a predicate before saving.');
            return;
        }
        if (!email) {
            setError('Please SignIn to save your work');
            return;
        }

        const response = await axios.post('http://localhost:4000/api/editUsers', {
            predicateExpression: expression,
            coverageType: coverageType,
            email: localStorage.getItem("token")
        });

        console.log('Save data response:', response.data); // Log response data

        if (response.data) {
            setSuccessMessage('Data saved successfully'); // Set success message
           setActionPerformed(true);
           setSuccActionPerformed(false);
            console.log('Data saved successfully');
            fetchHistoryData(); // Refresh history after saving
        } else {
            setError('Please login to save your data');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Error saving data');
        setActionPerformed(true);
    }
};



    const generatePredicateCoverage = (expression, symbols) => {
        let resultTable = "<table border='1'><thead><tr>";
        symbols.forEach(symbol => {
            resultTable += "<th>" + symbol + "</th>";
        });
        resultTable += "<th>Result</th></tr></thead><tbody>";

        const truthValues = generateTruthValues(symbols.length);
        truthValues.forEach(truthRow => {
            let evaluation = evaluateExpression(expression, symbols, truthRow);
            resultTable += "<tr>";
            truthRow.forEach(value => {
                resultTable += "<td>" + (value ? "T" : "F") + "</td>";
            });
            resultTable += "<td>" + (evaluation ? "T" : "F") + "</td></tr>";
        });
        resultTable += "</tbody></table>";
        return resultTable;
    };

    const generateCombinatorialCoverage = (expression, symbols) => {
        let resultTable = "<table border='1'><thead><tr>";
        symbols.forEach(symbol => {
            resultTable += "<th>" + symbol + "</th>";
        });
        resultTable += "<th>Result</th></tr></thead><tbody>";

        const truthValues = generateTruthValues(symbols.length);
        truthValues.forEach(truthRow => {
            const evaluation = evaluateExpression(expression, symbols, truthRow);
            resultTable += "<tr>";
            truthRow.forEach(value => {
                resultTable += "<td>" + (value ? "T" : "F") + "</td>";
            });
            resultTable += "<td>" + (evaluation ? "T" : "F") + "</td></tr>";
        });
        resultTable += "</tbody></table>";
        return resultTable;
    };

    const generateActiveClauseCoverage = (expression, symbols) => {
        const clauses = expression.split(/[&|]/);
        let resultTable = "<table border='1'><thead><tr>";
        symbols.forEach(symbol => {
            resultTable += "<th>" + symbol + "</th>";
        });
        resultTable += "<th>Result</th></tr></thead><tbody>";

        for (let i = 0; i < clauses.length; i++) {
            const activeClause = clauses[i].trim();
            const inactiveClauses = [...clauses.slice(0, i), ...clauses.slice(i + 1)];

            let modifiedExpression = expression.replace(activeClause, "1");
            inactiveClauses.forEach(clause => {
                modifiedExpression = modifiedExpression.replace(clause, "0");
            });

            const truthValues = generateTruthValues(symbols.length);
            truthValues.forEach(truthRow => {
                const evaluation = evaluateExpression(modifiedExpression, symbols, truthRow);
                resultTable += "<tr>";
                truthRow.forEach(value => {
                    resultTable += "<td>" + (value ? "T" : "F") + "</td>";
                });
                resultTable += "<td>" + (evaluation ? "T" : "F") + "</td></tr>";
            });
        }
        resultTable += "</tbody></table>";
        return resultTable;
    };

    const generateTruthValues = (numSymbols) => {
        const values = [];
        const numRows = Math.pow(2, numSymbols);
        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < numSymbols; j++) {
                row.push((i >> j) & 1);
            }
            values.push(row);
        }
        return values;
    };

    const evaluateExpression = (expression, symbols, truthValues) => {
        for (let i = 0; i < symbols.length; i++) {
            const symbolRegex = new RegExp(symbols[i], "g");
            expression = expression.replace(symbolRegex, truthValues[i] ? "1" : "0");
        }
        return eval(expression);
    };

   
    const generateTruthTableForHistory = (predicateExpression, coverageType) => {
        setExpression(predicateExpression);
        setCoverageType(coverageType);
        generateTruthTable();
    };
    
    const toggleHistory = () => {
        setShowHistory(!showHistory);
        setActionPerformed(true);
        setHideHistory(true);
        setSuccActionPerformed(true);
    };
    
    const hideHistoryView = () => {
        setShowHistory(false);
        setHideHistory(false);
        setActionPerformed(true);
        setSuccActionPerformed(true);
    };
    
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^[A-Za-z&|!()]*$/.test(value) || value === '') {
            setExpression(value);
            setError('');
            setSuccessMessage('');
            setActionPerformed(false);
        } else {
            setError("Invalid characters entered. Only letters, &, |, !, (, and ) are allowed.");
        }
    };
    
    return (
        <div className="container">
            <h1>Truth Table Generator</h1>
            <div className="input-container">
                <label htmlFor="expression">Enter your expression:</label>
                <label htmlFor="expression">Note: Expression field has certain limitations, such as it can accept only literals like &, |, and ! (and, or, not). Predicate has to be entered without any spaces.</label>
                <input
                    type="text"
                    id="expression"
                    value={expression}
                    onChange={handleInputChange}
                    placeholder="e.g., A&B|!(C|D)"
                />
            </div>
            <div className="input-container">
                <label htmlFor="coverageType">Select Coverage Type:</label>
                <select
                    id="coverageType"
                    value={coverageType}
                    onChange={(e) => setCoverageType(e.target.value)}
                >
                    <option value="Predicate Coverage">Predicate Coverage</option>
                    <option value="Combinatorial Coverage">Combinatorial Coverage</option>
                    <option value="Active Clause Coverage">Active Clause Coverage</option>
                </select>
            </div>
            <div className="button-container">
                <button className="generate-button" onClick={generateTruthTable}>Generate Truth Table</button>
                <button className="save-button" onClick={saveData}>Save Data</button>
                {!hideHistory && (
                    <button className="history-button" onClick={toggleHistory}>View History</button>
                )}
                {hideHistory && (
                    <button className="history-button" onClick={hideHistoryView}>Hide History</button>
                )}
            </div>
            {error && !actionPerformed && <p className="error">{error}</p>}
            {successMessage && !succActionPerformed && <p className="success">{successMessage}</p>}
            <div id="truthTable" className="truth-table">
                <div dangerouslySetInnerHTML={{ __html: truthTable }} />
            </div>
            {showHistory && (
                <div className="history-container">
                    <h2>History</h2>
                    <ul>
                        {historyData.map((data, index) => (
                            <li key={index}>
                                <p>Predicate Expression: {data.predicateExpression}</p>
                                <p>Coverage Type: {data.coverageType}</p>
                                <button className="history-button" onClick={() => generateTruthTableForHistory(data.predicateExpression, data.coverageType)}>Generate Truth Table</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
    };
    
    export default TruthTableGenerator;
    