import React, { useState, useEffect } from "react";
import Base from "../../core/Base";
import { Modal, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import UserApi from "../helper/userapicalls";
import { Link } from "react-router-dom";

import moment from "moment";

const cookies = new Cookies();

const JobList = () => {
  // State Variables
  const [showJobCreate, setShowJobCreate] = useState(false);
  const [showJobEdit, setShowJobEdit] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [token, setToken] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [jobDetails, setJobDetails] = useState({});
  const [jobs, setJobs] = useState([]);

  const [job, setJob] = useState({
    _id: "",
    title: "",
    salary: "",
    position: "",
    details: "",
    error: "",
    loading: false,
    didRedirect: false,
  });

  // Handling Changes

  const handleClose = () => setShowJobCreate(false);
  const handleCloseEdit = () => setShowJobEdit(false);

  const handleShowJobEdit = async (jobId) => {
    setShowJobEdit(true);
    jobs.map((job) => {
      if (job._id.toString() == jobId.toString()) {
        setJob(job);
      }
    });
  };

  const handleChange = (name) => (event) => {
    setJob({ ...job, [name]: event.target.value });
  };

  async function fetchJobList() {
    try {
      let token = cookies.get("token");
      setToken(token);
      let response = await UserApi.jobList(token);
      setJobs(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // Use Effect Method

  useEffect(() => {
    fetchJobList();
  }, []);

  // Execution Methods

  const createJob = async (event) => {
    event.preventDefault();
    if (
      job.title == "" ||
      job.details == "" ||
      job.salary == "" ||
      job.position == ""
    ) {
      return;
    }
    let createJob = await UserApi.createJob(token, job);
    if (createJob.status == 200) {
      setSuccessMsg("Job Created Successfully");
      setShowSuccessMsg(true);
    } else {
      return;
    }
    fetchJobList();
    handleClose();
  };

  const updateJob = async (event) => {
    console.log(job);
    event.preventDefault();
    if (
      job.title == "" ||
      job.details == "" ||
      job.salary == "" ||
      job.position == ""
    ) {
      return;
    }
    let updateJob = await UserApi.updateJob(token, job);
    console.log(updateJob);
    if (updateJob.status == 200) {
      setSuccessMsg("Job Updated Successfully");
      setShowSuccessMsg(true);
    } else {
      return;
    }
    fetchJobList();
    handleCloseEdit();
  };

  const deleteJob = async (event, id) => {
    if (window.confirm("Delete the job?")) {
      let deleteJob = await UserApi.deleteJob(token, id);
      if (deleteJob.status == 200) {
        setSuccessMsg("Job Deleted Successfully");
        setShowSuccessMsg(true);
      } else {
        return;
      }
      fetchJobList();
    }
  };

  return (
    <Base title="All Jobs">
      <div className="row">
        <div className="col-12 text-center mb-3 mt-0">
          <button
            onClick={() => setShowJobCreate(true)}
            className="btn btn-warning shadow"
          >
            Create Job
          </button>
        </div>
        {showSuccessMsg && (
          <div className="col-8 mx-auto">
            <div className="alert alert-success text-center">{successMsg}</div>
          </div>
        )}
        {jobs.map((job) => (
          <div key={job._id} className="col-md-10 col-sm-12 mb-3 mx-auto">
            <div className="card-cus shadow">
              <div className="card-body">
                <h4
                  style={{ color: "#000" }}
                  className="text-center font-weight-bold"
                >
                  {job.title}
                </h4>
                <div className="text-center">
                  <span>Salary:- {job.salary}</span>
                  <span className="ml-4">Positions:- {job.position}</span>
                </div>
                <div className="text-left text-justify mt-3">
                  Job Details:- {job.details}
                </div>
                <div className="row">
                  <div
                    className="col-12 text-left"
                    style={{
                      position: "",
                      bottom: "2px",
                      right: "5px",
                    }}
                  >
                    <div
                      className="pt-4 pl-1"
                      style={{ bottom: "2px", right: "30px" }}
                    >
                      <span style={{ color: "#9E9EA1" }}>
                        Posted On:- {moment(job.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="col-8 text-left pt-2">
                    <div className="btn-group">
                      <button
                        className="btn btn-info"
                        onClick={() => handleShowJobEdit(job._id)}
                        style={{ cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteJob(this, job._id)}
                        style={{ cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="col-4 text-right pt-2">
                    <Link
                      className="btn btn-primary"
                      style={{ cursor: "pointer" }}
                      to={"/admin/job-application/"+job._id}
                    >
                      Check Applications
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Job Modal Starts */}
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showJobCreate}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Job Title</label>
                <input
                  onChange={handleChange("title")}
                  className="form-control"
                  type="text"
                  value={job.title}
                  placeholder="Enter Job Title"
                />
              </div>
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Salary</label>
                <input
                  onChange={handleChange("salary")}
                  className="form-control"
                  type="number"
                  value={job.salary}
                  placeholder="Enter salary"
                />
              </div>
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Positions</label>
                <input
                  onChange={handleChange("position")}
                  className="form-control"
                  type="number"
                  value={job.position}
                  placeholder="Enter Positions Available"
                />
              </div>
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Job Description</label>
                <textarea
                  onChange={handleChange("details")}
                  value={job.details}
                  placeholder="Job Description"
                  rows="3"
                  columns="3"
                  className="form-control"
                ></textarea>
              </div>
              <div className="col-md-12 col-sm-12 mx-auto text-right">
                <button onClick={createJob} className="btn btn-success">
                  Create Job
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* Create Job Modal Ends */}

      {/* Edit Job Modal Starts */}
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showJobEdit}
        onHide={handleCloseEdit}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Job Title</label>
                <input
                  onChange={handleChange("title")}
                  className="form-control"
                  type="text"
                  value={job.title}
                  placeholder="Enter Job Title"
                />
              </div>
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Salary</label>
                <input
                  onChange={handleChange("salary")}
                  className="form-control"
                  type="number"
                  value={job.salary}
                  placeholder="Enter salary"
                />
              </div>
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Positions</label>
                <input
                  onChange={handleChange("position")}
                  className="form-control"
                  type="number"
                  value={job.position}
                  placeholder="Enter Positions Available"
                />
              </div>
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Job Description</label>
                <textarea
                  onChange={handleChange("details")}
                  value={job.details}
                  placeholder="Job Description"
                  rows="3"
                  columns="3"
                  className="form-control"
                ></textarea>
              </div>
              <div className="col-md-12 col-sm-12 mx-auto text-right">
                <button onClick={updateJob} className="btn btn-success">
                  Update Job
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* Create Job Modal Ends */}
    </Base>
  );
};

export default JobList;
