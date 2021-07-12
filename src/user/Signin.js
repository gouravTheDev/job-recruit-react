import React, { useState } from "react";
import Base from "../core/Base";
import { Redirect } from "react-router-dom";
import { Link, withRouter } from "react-router-dom";

import { signin, authenticate, isAutheticated, isAdmin } from "../auth/helper";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false,
  });
  const [admin, setAdmin] = useState(false);

  const { email, password, error, loading, didRedirect } = values;
  const { user } = isAutheticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    if (!email || !password || email == "" || password == "") {
      setValues({
        ...values,
        error: "Please fill all the fields",
        loading: false,
      });
      return;
    }
    let data = await signin({ email, password });
    if (data && data != {}) {
      if (data.status == 201) {
        setValues({ ...values, error: data.message, loading: false });
      } else {
        if (data.data.role == "admin") {
          setAdmin(true);
        }
        authenticate(data, () => {
          setValues({
            ...values,
            didRedirect: true,
          });
        });
      }
    } else {
      setValues({ ...values, error: "Could not process now!", loading: false });
    }
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (admin) {
        return <Redirect to="/admin/job/list" />;
      } else {
        return <Redirect to="/user/job/list" />;
      }
    }
    if (isAutheticated() && isAdmin()) {
      return <Redirect to="/admin/job/list" />;
    } else if (isAutheticated()) {
      return <Redirect to="/user/job/list" />;
    }
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
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

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="">Email</label>
              <input
                onChange={handleChange("email")}
                value={email}
                className="form-control"
                type="email"
                required
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label className="">Password</label>
              <input
                onChange={handleChange("password")}
                value={password}
                className="form-control"
                type="password"
                required
                placeholder="Enter Password"
              />
            </div>
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Login
            </button>
          </form>
          <div className="form-group text-center mt-4">
            <Link to="/signup">New User? Sign Up</Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base
      title="Login to Your Account"
      description="A page for user to sign in!"
    >
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
    </Base>
  );
};

export default Signin;
