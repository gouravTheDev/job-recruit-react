import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    if(password == ''  || name == ''  || email == ''){
      setValues({ ...values, error: "Please fill all the fields", loading: false });
      return;
    }
    if(password.length < 6){
      setValues({ ...values, error: "Password must be at least 6 characters!", loading: false });
      return;
    }
    signup({ name, email, password })
      .then((data) => {
        if (data.status == 201) {
          setValues({ ...values, error: data.message, success: false });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: "",
            success: true,
          });
        }
      })
      .catch(console.log("Error in signup"));
  };

  const signUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="">Name</label>
              <input
                required
                className="form-control"
                onChange={handleChange("name")}
                type="text"
                value={name}
                placeholder="Enter Full Name"
              />
            </div>
            <div className="form-group">
              <label className="">Email</label>
              <input
                required
                className="form-control"
                onChange={handleChange("email")}
                type="email"
                value={email}
                placeholder="Enter Email"
              />
            </div>

            <div className="form-group">
              <label className="">Password</label>
              <input
                required
                onChange={handleChange("password")}
                className="form-control"
                type="password"
                value={password}
                placeholder="Enter Password"
              />
            </div>
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            New account was created successfully. Please
            <Link to="/signin">Login Here</Link>
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base title="Create Account" description="A page for user to sign up!">
      {successMessage()}
      {errorMessage()}
      {signUpForm()}
    </Base>
  );
};

export default Signup;
