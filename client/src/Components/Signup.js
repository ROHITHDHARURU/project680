import { useState} from "react";
import axios from "axios";
import React from "react";
import {useNavigate } from "react-router-dom";

 


const Signup = () => {
	const [data, setData] = useState({
		fullName: "",
		email: "",
		password: "",
		bio:"",
		image2:""
	});


  const postDetails = (pics) => {
    console.log(pics)
     if (pics.type === "image/jpeg" || pics.type === "image/png") {
       const data2 = new FormData();
       data2.append("file", pics);
        data2.append("upload_preset", "profilemaker");
        data2.append("cloud_name", "dwe0zhrgm");
        fetch("https://api.cloudinary.com/v1_1/dwe0zhrgm/image/upload", {
         method: "post",
         body: data2,
       })
          .then((res) => res.json())
          .then((data2) => {
            console.log(data2.url.toString());
            setData({...data,image2:data2.url.toString()})
            
            //console.log(pic);
          })
          .catch((err) => {
            console.log(err);
          });
     } 
   };

  
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:4000/api/users";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
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
		<section className="vh-100"  >
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
      
                      <input type="text" name="fullName" className="form-control form-control-lg"  onChange={handleChange} value={data.fullName} required/>
      
                    </div>
                  </div>


                  <div className="row align-items-center pt-4 pb-3">
                    <div className="col-md-3 ps-5">
      
                      <h6 className="mb-0">Email</h6>
      
                    </div>
                    <div className="col-md-9 pe-5">
      
                      <input type="email" name="email" className="form-control form-control-lg"  placeholder="Enter your Email Id" onChange={handleChange} value={data.email} required/>
      
                    </div>
                  </div>

                  <div className="row align-items-center pt-4 pb-3">
                    <div className="col-md-3 ps-5">
      
                      <h6 className="mb-0">Password</h6>
      
                    </div>
                    <div className="col-md-9 pe-5">
      
                      <input type="password"  name="password" className="form-control form-control-lg"  onChange={handleChange} value={data.password} required/>
      
                    </div>
                  </div>

                  
                  

      
                 
      
                  <hr className="mx-n3"/>
      
                  <div className="row align-items-center py-3">
                    <div className="col-md-3 ps-5">
      
                      <h6 className="mb-0">Bio</h6>
      
                    </div>
                    <div className="col-md-9 pe-5">
      
                      <textarea className="form-control"  name="bio" rows="3" placeholder="Enter your Bio" onChange={handleChange} value={data.bio} required></textarea>
      
                    </div>
                  </div>
      
                  <hr className="mx-n3"/>
      
                  <div className="row align-items-center py-3">
                    <div className="col-md-3 ps-5">
      
                      <h6 className="mb-0">Upload Profile Picture</h6>
      
                    </div>
                    <div className="col-md-9 pe-5">

      
                      <input className="form-control form-control-lg" name="image" id="formFileLg" type="file"  onChange={(e) => postDetails(e.target.files[0])} value={data.image}  />
                      <div className="small text-muted mt-2">Upload your Profile for completing the sign up</div>
      
                    </div>
                  </div>
				  {error && <div className="form-outline mb-4 text-danger">{error}</div>}
                  <hr className="mx-n3"/>
      
                  <div className="px-5 py-4" >
                    <button type="submit" className="btn btn-primary btn-lg" onSubmit={handleSubmit} value="submit" >Sign Up</button>
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
