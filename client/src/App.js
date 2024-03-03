import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./Components/Header";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Predicate from "./Components/Predicate"

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/signup" element ={<Signup/>}/>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Predicate/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/predicate" element={<Predicate/>} />
    </Routes>
  </Router>
);

export default App;
