import React, { useState, useEffect } from "react";
import Base from "../../core/Base";
import { Modal, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import UserApi from "../helper/userapicalls";

import moment from "moment";

const cookies = new Cookies();

const JobList = () => {
  // State Variables
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [token, setToken] = useState("");
  const [jobDetails, setJobDetails] = useState({});
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState("");

  // Handling Changes

  const handleClose = () => setShowJobDetails(false);

  const handleShowJobDetails = async (jobId) => {
    setShowJobDetails(true);
    jobs.map((job) => {
      if (job._id.toString() == jobId.toString()) {
        setJobDetails(job);
      }
    });
  };

  const handleFileChange = (name) => (event) => {
    console.log(event.target.files[0]);
    setResume(event.target.files[0]);
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

  const applyJob = async (event) => {
    event.preventDefault();
    if (resume == "") {
      return;
    }
    let formData = new FormData();
    formData.set("resume", resume);
    formData.set("job", jobDetails._id);
    let applyJob = await UserApi.applyJob(token, formData);
    if (applyJob.status == 200) {
      setShowSuccessMsg(true);
    } else {
      return;
    }
    fetchJobList();
    handleClose();
  };

  return (
    <Base title="All Jobs">
      <div className="row">
        {showSuccessMsg && (
          <div className="col-8 mx-auto">
            <div className="alert alert-success text-center">
              You have successfully applied to the job!
            </div>
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
                    className="col-8 text-left"
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
                  <div className="col-4 text-right pt-2">
                    {!job.isApplied ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleShowJobDetails(job._id)}
                        style={{ cursor: "pointer" }}
                      >
                        Apply to this job
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        disabled="true"
                        style={{ cursor: "not-allowed" }}
                      >
                        Already Applied
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Job Modal Starts */}
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showJobDetails}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Job Title:- {jobDetails.title}</h6>
          <h6>Positions Available:- {jobDetails.position}</h6>
          <h6>Salary:- {jobDetails.salary}</h6>
          <h6>Job Description:- {jobDetails.details}</h6>
          <hr />
          <h5>Apply to this Job</h5>
          <hr />
          <form>
            <div className="row">
              <div className="col-md-12 col-sm-12 mx-auto mb-3 form-group">
                <label>Upload Resume</label>
                <input
                  onChange={handleFileChange(this)}
                  className="form-control"
                  type="file"
                  placeholder="Enter Project Name"
                />
              </div>
              <div className="col-md-12 col-sm-12 mx-auto text-right">
                <button onClick={applyJob} className="btn btn-success">
                  Apply Now
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* APply Job Modal Ends */}
    </Base>
  );
};

export default JobList;
