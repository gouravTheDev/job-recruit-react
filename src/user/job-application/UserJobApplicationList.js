import React, { useState, useEffect } from "react";
import Base from "../../core/Base";
import { Modal, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import UserApi from "../helper/userapicalls";

import moment from "moment";

const cookies = new Cookies();

const UserJobApplicationList = () => {
  // State Variables
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [token, setToken] = useState("");
  const [jobDetails, setJobDetails] = useState({});
  const [jobApplications, setJobApplications] = useState([]);
  const [resume, setResume] = useState("");

  // Handling Changes

  const handleClose = () => setShowJobDetails(false);

  const handleShowJobDetails = async (jobId) => {
    setShowJobDetails(true);
    jobApplications.map((job) => {
      if (job._id.toString() == jobId.toString()) {
        setJobDetails(job);
      }
    });
  };

  const handleFileChange = (name) => (event) => {
    console.log(event.target.files[0]);
    setResume(event.target.files[0]);
  };

  async function fetchJobApplicationList() {
    try {
      let token = cookies.get("token");
      setToken(token);
      let response = await UserApi.jobApplications(token);
      console.log(response);
      setJobApplications(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // Use Effect Method

  useEffect(() => {
    fetchJobApplicationList();
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
    fetchJobApplicationList();
    handleClose();
  };

  return (
    <Base title="My Applications">
      <div className="row">
        {showSuccessMsg && (
          <div className="col-8 mx-auto">
            <div className="alert alert-success text-center">
              You have successfully applied to the job!
            </div>
          </div>
        )}
        <div className="col-10 mx-auto card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Job Title</th>
                    <th scope="col">Salary</th>
                    <th scope="col">Post Date</th>
                    <th scope="col">Apply Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobApplications.map((jobApp) => (
                    <tr key={jobApp._id}>
                      <td>{jobApp.job.title}</td>
                      <td>{jobApp.job.salary}</td>
                      <td>
                        {moment(jobApp.job.createdAt).format("DD/MM/YYYY")}
                      </td>
                      <td>{moment(jobApp.createdAt).format("DD/MM/YYYY")}</td>
                      <td>
                        {jobApp.application_status == "pending" && (
                          <span className="badge badge-warning">Pending</span>
                        )}
                        {jobApp.application_status == "selected" && (
                          <span className="badge badge-success">Selected</span>
                        )}
                        {jobApp.application_status == "rejected" && (
                          <span className="badge badge-danger">Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default UserJobApplicationList;
