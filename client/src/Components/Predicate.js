import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TruthTableGenerator.css';

const TruthTableGenerator = () => {
    const [expression, setExpression] = useState('');
    const [coverageType, setCoverageType] = useState('Predicate Coverage');
    const [truthTable, setTruthTable] = useState('');
    const [testCases, setTestCases] = useState([]); // State to store generated test cases
    const [error, setError] = useState('');
    const [historyData, setHistoryData] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [hideHistory, setHideHistory] = useState(false);
    const [actionPerformed, setActionPerformed] = useState(false);
    const [succActionPerformed, setSuccActionPerformed] = useState(false);
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

            const response = await axios.get('http://54.86.131.81:4000/api/history', {
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
            setError("Please enter an expression");
            return;
        }

        try {
            let resultTable = '';
            let testCasesData = ''; // Variable to store test cases
            if (coverageType === "Predicate Coverage") {
                resultTable = generatePredicateCoverage(expression, symbols);
                testCasesData = generatePredicateCoverageTestCases(expression, symbols);
            } else if (coverageType === "Combinatorial Coverage") {
                resultTable = generateCombinatorialCoverage(expression, symbols);
                testCasesData = generateCombinatorialCoverageTestCases(expression, symbols);
            } else if (coverageType === "Active Clause Coverage") {
                resultTable = generateActiveClauseCoverage(expression, symbols);
                testCasesData = generateActiveClauseCoverageTestCases(expression, symbols);
            }

            setTruthTable(resultTable);
            setTestCases(testCasesData); // Set the test cases
            setError('');
            setSuccessMessage('');
            setActionPerformed(true);
        } catch (error) {
            console.error('Error:', error);
            setError('Error generating truth table');
            setActionPerformed(true);
        }
    };

    const generatePredicateCoverage = (expression, symbols) => {
        let resultTable = "<table border='1'><thead><tr><th>Row No</th>";
        symbols.forEach(symbol => {
            resultTable += "<th>" + symbol + "</th>";
        });
        resultTable += "<th>Result</th></tr></thead><tbody>";

        const truthValues = generateTruthValues(symbols.length);
        truthValues.forEach((truthRow, index) => {
            let evaluation = evaluateExpression(expression, symbols, truthRow);
            resultTable += "<tr>";
            resultTable += "<td>" + (index + 1) + "</td>"; // Row number column
            truthRow.forEach(value => {
                resultTable += "<td class='" + (value ? 'true' : 'false') + "'>" + (value ? "T" : "F") + "</td>";
            });
            resultTable += "<td class='" + (evaluation ? 'true' : 'false') + "'>" + (evaluation ? "T" : "F") + "</td></tr>";
        });
        resultTable += "</tbody></table>";
        return resultTable;
    };

    const generateCombinatorialCoverage = (expression, symbols) => {
        let resultTable = "<table border='1'><thead><tr><th>Row No</th>";
        symbols.forEach(symbol => {
            resultTable += "<th>" + symbol + "</th>";
        });
        resultTable += "<th>Result</th></tr></thead><tbody>";

        const truthValues = generateTruthValues(symbols.length);
        truthValues.forEach((truthRow, index) => {
            const evaluation = evaluateExpression(expression, symbols, truthRow);
            resultTable += "<tr>";
            resultTable += "<td>" + (index + 1) + "</td>"; // Row number column
            truthRow.forEach(value => {
                resultTable += "<td class='" + (value ? 'true' : 'false') + "'>" + (value ? "T" : "F") + "</td>";
            });
            resultTable += "<td class='" + (evaluation ? 'true' : 'false') + "'>" + (evaluation ? "T" : "F") + "</td></tr>";
        });
        resultTable += "</tbody></table>";
        return resultTable;
    };

    const generateActiveClauseCoverage = (expression, symbols) => {
        let resultTable = "<table border='1'><thead><tr><th>Row No</th>";
        symbols.forEach(symbol => {
            resultTable += "<th>" + symbol + "</th>";
        });
        resultTable += "<th>Result</th></tr></thead><tbody>";

        const truthValues = generateTruthValues(symbols.length);
        truthValues.forEach((truthRow, index) => {
            const evaluation = evaluateExpression(expression, symbols, truthRow);
            resultTable += "<tr>";
            resultTable += "<td>" + (index + 1) + "</td>"; // Row number column
            truthRow.forEach(value => {
                resultTable += "<td class='" + (value ? 'true' : 'false') + "'>" + (value ? "T" : "F") + "</td>";
            });
            resultTable += "<td class='" + (evaluation ? 'true' : 'false') + "'>" + (evaluation ? "T" : "F") + "</td></tr>";
        });
        resultTable += "</tbody></table>";
        return resultTable;
    };

    const generatePredicateCoverageTestCases = (expression, symbols) => {
        const testCases = [];
        const truthValues = generateTruthValues(symbols.length);
        truthValues.forEach((truthRow, index) => {
            let testCase = "Test Case " + (index + 1) + ": ";
            symbols.forEach((symbol, i) => {
                testCase += symbol + " = " + (truthRow[i] ? "T" : "F") + ", ";
            });
            testCase += "Expected Result: " + (evaluateExpression(expression, symbols, truthRow) ? "T" : "F");
            testCases.push(testCase);
        });
        return testCases;
    };

    const generateCombinatorialCoverageTestCases = (expression, symbols) => {
        const testCases = [];
        const truthValues = generateTruthValues(symbols.length);
        truthValues.forEach((truthRow, index) => {
            let testCase = "Test Case " + (index + 1) + ": ";
            symbols.forEach((symbol, i) => {
                testCase += symbol + " = " + (truthRow[i] ? "T" : "F") + ", ";
            });
            testCase += "Expected Result: " + (evaluateExpression(expression, symbols, truthRow) ? "T" : "F");
            testCases.push(testCase);
        });
        return testCases;
    };

    const generateActiveClauseCoverageTestCases = (expression, symbols) => {
        const result = [];
    
        // Go through each variable
        for (let k = 0; k < symbols.length; k++) {
            const t = []; // List storing row numbers where the corresponding predicate is true
            const f = []; // List storing row numbers where the corresponding predicate is false
    
            // Go through each row of the truth table
            for (let i = 0; i < Math.pow(2, symbols.length); i++) {
                const truthRow = generateTruthRow(symbols.length, i);
                const expressionResult = evaluateExpression(expression, symbols, truthRow);
    
                // Calculate P (x = true) and P (x = false) for the current variable
                const tvar = evaluateExpression(expression, symbols, truthRow.map((value, index) => index === k ? true : value));
                const fvar = evaluateExpression(expression, symbols, truthRow.map((value, index) => index === k ? false : value));
    
                // If Px = P (x = true) XOR P (x = false) is true, the variable determines the predicate
                if (tvar !== fvar) {
                    // In this row, if the variable is true, add it to t, else add it to f
                    if (truthRow[k]) {
                        t.push(i);
                    } else {
                        f.push(i);
                    }
                }
            }
    
            const gacc = [];


            // Take the matched elements from t and f lists and put them into gacc
            for (let i = 0; i < t.length; i++) {
                for (let j = 0; j < f.length; j++) {
                    gacc.push(`(${t[i] + 1}, ${f[j] + 1})`); // Adjusting row numbers to start from 1 and appending clause name
                }
            }
        
            // Add the gacc to the result
            result.push(`Clause ${symbols[k]}: ${gacc.join(', ')}`);
        }
    
        return result;
    };
    
    
    // Helper function to generate a truth row based on the index
    const generateTruthRow = (length, index) => {
        const row = [];
        for (let i = 0; i < length; i++) {
            row.push((index >> i) & 1);
        }
        return row;
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

    const saveData = async () => {
        try {
            setError('');
            const email = localStorage.getItem('token');
            if (!expression) {
                setError('Please enter a predicate before saving.');
                return;
            }
            if (!email) {
                setError('Please sign in to save your work');
                alert('Please SignIn')
                return;
            }

            const response = await axios.post('http://54.86.131.81:4000/api/editUsers', {
                predicateExpression: expression,
                coverageType: coverageType,
                email: email
            });

            console.log('Save data response:', response.data); // Log response data

            if (response.data) {
                setSuccessMessage('Data saved successfully');
                setActionPerformed(true);
                setSuccActionPerformed(false);
                console.log('Data saved successfully');
                fetchHistoryData();
            } else {
                setError('Failed to save data. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error saving data');
            setActionPerformed(true);
        }
    };

    const toggleHistory = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            setError('Please login to your account to view history');
            alert('Please login to your account to view history');
            return
        }

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
        setError('');
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
                <label htmlFor="coverageType">Select Test Coverage Type:</label>
                <label htmlFor="coverageType">Note: By Default Tests would be generated for the Predicate Coverage.</label>
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
                <button className="generate-button" onClick={generateTruthTable}>Generate Truth Table and Tests</button>
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
                {actionPerformed && ( /* Conditionally render "Test Cases" only when actionPerformed is true */
                    <div className="test-cases">
                        <h2>Tests</h2>
                        {testCases && (
                            <ul>
                                {testCases.map((testCase, index) => (
                                    <li key={index}>{testCase}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {showHistory && (
    <div className="history-container">
        <h2>History</h2>
        <ul>
            {historyData.map((data, index) => (
                <li key={index}>
                    <p>Predicate Expression: {data.predicateExpression}</p>
                    <p>Coverage test type used: {data.coverageType}</p>
                    <button className="history-button" id="populate_button" onClick={() => generateTruthTableForHistory(data.predicateExpression, data.coverageType)}>Populate this data</button>
                    {data.testCases && (
                        <div>
                            <h3>Test Cases</h3>
                            <ul>
                                {data.testCases.map((testCase, index) => (
                                    <li key={index}>{testCase}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    </div>
)}

        </div>
    );
};

export default TruthTableGenerator;
