import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Base from "../../core/Base";
import { Modal, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import UserApi from "../helper/userapicalls";
import { API } from "../../backend";

import moment from "moment";

const cookies = new Cookies();

const UserJobApplicationList = () => {
  // State Variables
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [token, setToken] = useState("");
  const [jobApplications, setJobApplications] = useState([]);
  const [apiLink, setApiLink] = useState(API);
  const [msg, setMsg] = useState("");

  let { id } = useParams();

  const [jobId, setJobId] = useState(id);

  async function fetchJobApplicationList() {
    try {
      let token = cookies.get("token");
      setToken(token);
      let response = await UserApi.jobApplications(token, jobId);
      console.log(response);
      if (response.status == 200) {
        setJobApplications(response.data);
      } else {
        setJobApplications([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Use Effect Method

  useEffect(() => {
    fetchJobApplicationList();
  }, []);

  // Execution Methods

  const selectApplication = async (event, jobId) => {
    let selectApplication = await UserApi.updateJobApplication(token, {
      id: jobId,
      application_status: "selected",
    });
    if (selectApplication.status == 200) {
      setMsg("Application Selected");
      setShowSuccessMsg(true);
    } else {
      return;
    }
    fetchJobApplicationList();
  };

  const rejectApplication = async (event, jobId) => {
    event.preventDefault();
    let selectApplication = await UserApi.updateJobApplication(token, {
      id: jobId,
      application_status: "rejected",
    });
    if (selectApplication.status == 200) {
      setMsg("Application Rejected");
      setShowSuccessMsg(true);
    } else {
      return;
    }
    fetchJobApplicationList();
  };

  return (
    <Base title="Job Applications">
      <div className="row">
        {showSuccessMsg && (
          <div className="col-8 mx-auto">
            <div className="alert alert-warning text-center">{msg}</div>
          </div>
        )}
        <div className="col-10 mx-auto card shadow">
          <div className="card-body">
            {jobApplications.length > 0 && (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Job Title</th>
                      <th scope="col">User</th>
                      <th scope="col">Email</th>
                      <th scope="col">Apply Date</th>
                      <th scope="col">Resume</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobApplications.map((jobApp) => (
                      <tr key={jobApp._id}>
                        <td>{jobApp.job.title}</td>
                        <td>{jobApp.user.name}</td>
                        <td>{jobApp.user.email}</td>
                        <td>{moment(jobApp.date).format("DD/MM/YYYY")}</td>
                        <td>
                          <a
                            href={apiLink + "/uploads/resume/" + jobApp.resume}
                            target="_blank"
                          >
                            Download
                          </a>
                        </td>
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
                        <td>
                          {jobApp.application_status == "pending" && (
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                  selectApplication(this, jobApp._id)
                                }
                              >
                                Select
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  rejectApplication(this, jobApp._id)
                                }
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {jobApp.application_status != "pending" && (
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-primary"
                                disabled={true}
                              >
                                Select
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                disabled={true}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {jobApplications.length == 0 && (
              <div className="alert alert-warning">No applications yet!</div>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default UserJobApplicationList;
