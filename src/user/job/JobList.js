import React, { useState, useEffect } from "react";
import Base from "../../core/Base";
import { Modal, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import UserApi from "../helper/userapicalls";

import moment from "moment";

const cookies = new Cookies();

const UserTodos = () => {
  // State Variables
  const [show, setShow] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  const [task, setTask] = useState("");
  const [details, setDetails] = useState("");
  const [token, setToken] = useState("");
  const [project, setProject] = useState("");
  const [projectDetails, setProjectDetails] = useState({});
  const [jobs, setJobs] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Handling Changes

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShowProjectDetails(false);
  const handleShow = () => setShow(true);
  const handleShowJobDetails = async (projectId) => {
    setTasks([]);
    setProjectDetails({});
    setDetails("");
    setShowProjectDetails(true);
    let proj = {};
    jobs.map((project) => {
      if (project._id.toString() == projectId.toString()) {
        setProjectDetails(project);
        proj = project;
      }
    });
    console.log(projectId);
    let token = cookies.get("token");
    let tasks = await UserApi.fetchTasks(token, projectId);
    if (tasks.status == 200) {
      setTasks(tasks.data);
    }
    if (proj.details == "" || !proj.details) {
      setShowDetailsForm(true);
      setShowEditButton(false);
    } else {
      setDetails(proj.details);
      setShowDetailsForm(false);
      setShowEditButton(true);
    }
  };

  const handleTask = (name) => (event) => {
    setTask(event.target.value);
  };

  const handleProject = (name) => (event) => {
    setProject(event.target.value);
  };

  const handleDetails = (name) => (event) => {
    setDetails(event.target.value);
  };

  async function fetchJobList() {
    try {
      let token = cookies.get("token");
      setToken(token);
      let response = await UserApi.jobList(token);
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // Use Effect Method

  useEffect(() => {
    fetchJobList();
  }, []);

  // Execution Methods

  const onSubmit = async (event) => {
    event.preventDefault();
    let existingjobs = jobs;
    if (project == "") {
      return;
    }
    let submitProject = await UserApi.createProject(token, project);
    if (submitProject.status == 200) {
      existingjobs.push(submitProject.data);
    } else {
      return;
    }
    setJobs(existingjobs);
    setProject("");
    fetchJobList();
  };

  const onTaskSubmit = async (event) => {
    event.preventDefault();
    if (task == "") {
      return;
    }
    setTask("");
    let existingTasks = [...tasks];
    // update state locally
    let d = new Date();
    let n = d.getTime();
    let newTaskObject = {};
    newTaskObject._id = n;
    newTaskObject.title = task;
    existingTasks.push(newTaskObject);
    setTasks(existingTasks);

    // Update DB
    let submitTask = await UserApi.createTask(token, task, projectDetails._id);

    setTasks(submitTask.data);

    fetchJobList();
  };

  const updateTask = async (taskId, body, index) => {
    let existingTasks = [...tasks];
    if (body.done) {
      existingTasks[index].done = true;
    } else {
      existingTasks[index].done = false;
    }
    setTasks(existingTasks);
    let updateTask = await UserApi.updateTask(token, taskId, body);
    if (updateTask.status == 200) {
      setTasks(updateTask.data);
    } else {
      return;
    }
    fetchJobList();
  };

  const deleteTask = async (taskId, index) => {
    let existingTasks = [...tasks];
    existingTasks[index].isDeleted = true;
    if (index > -1) {
      existingTasks.splice(index, 1);
    }
    setTasks(existingTasks);
    let updateTask = await UserApi.updateTask(token, taskId, {
      isDeleted: true,
    });
    if (updateTask.status == 200) {
      setTasks(updateTask.data);
    } else {
      return;
    }
    fetchJobList();
  };

  const deleteProject = async (projectId) => {
    if (window.confirm("Delete the Project?")) {
      setShowProjectDetails(false);
      let updateProject = await UserApi.updateProject(token, projectId, {
        isDeleted: true,
      });
      console.log(updateProject);
      if (updateProject.status == 200) {
        setJobs(updateProject.data);
      } else {
        return;
      }
      fetchJobList();
    }
  };

  const onUpdateProject = async (event) => {
    event.preventDefault();
    if (details == "") {
      return;
    }
    let updatedData = { ...projectDetails };
    updatedData.details = details;
    setProjectDetails(updatedData);
    setDetails("");
    setShowDetailsForm(false);
    setShowEditButton(true);
    let updateProject = await UserApi.updateProject(token, projectDetails._id, {
      details: details,
    });
    console.log(updateProject);

    fetchJobList();
  };

  // Render Functions

  const checkBox = (taskId, obj, index) => {
    let checked = obj.checked;
    let updateObj = {};
    if (checked) {
      updateObj.done = false;
    } else {
      updateObj.done = true;
    }
    return (
      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input custom-check"
          defaultChecked={checked}
          onChange={() => updateTask(taskId, updateObj, index)}
        />
      </div>
    );
  };

  return (
    <Base title="All Jobs">
      <div className="row">
        {jobs.map((job) => (
          <div key={job._id} className="col-md-10 col-sm-12 mb-3 mx-auto">
            <div
              className="card-cus shadow"
              style={{ cursor: "pointer" }}
            >
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
                <div className="text-left text-justify mt-3">Job Details:- {job.details}</div>  
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
                        Posted On:-{" "}
                        {moment(job.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="col-4 text-right pt-2">
                    <button className="btn btn-primary">Apply to this job</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal Starts */}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showProjectDetails}
        onHide={handleClose2}
        id="modalProject"
      >
        <Modal.Header closeButton>
          <Modal.Title className="font-weight-bold">
            {projectDetails.category}{" "}
            <button
              className="btn btn-sm btn-danger ml-4"
              style={{ height: "32px", width: "32px", borderRadius: "50%" }}
              title="Delete"
              onClick={() => deleteProject(projectDetails._id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container row px-4 py-4">
            <div className="col-12 text-left">
              <h5 className="mb-3 font-weight-bold">
                <i className="fas fa-check-square"></i> Project Details
              </h5>{" "}
              <hr />
              <p style={{ fontSize: "1.2em" }}>{projectDetails.details}</p>
              <div className={showEditButton ? "" : "hidden"}>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    setShowDetailsForm(true);
                    setShowEditButton(false);
                  }}
                  style={{ height: "32px", width: "32px", borderRadius: "50%" }}
                >
                  <i className="fas fa-edit"></i>
                </button>
              </div>
              <form className={showDetailsForm ? "" : "hidden"}>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    value={details}
                    onChange={handleDetails("details")}
                    placeholder="Update Project Details"
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-group text-right">
                  <button
                    className="btn btn-success shadow"
                    onClick={onUpdateProject}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="container row px-4 py-4">
            <div className="col-12 text-left">
              <h5 className="mb-3 font-weight-bold">
                <i className="fas fa-tasks"></i> Task List
              </h5>
              <hr />
            </div>
            <div className="col-12">
              {tasks.map((task, index) => (
                <div className="row mb-3" key={task._id}>
                  <div className="col-1 text-right">
                    {task.done
                      ? checkBox(task._id, { checked: true }, index)
                      : checkBox(task._id, { checked: false }, index)}
                  </div>
                  <div className="col-8 text-left">
                    <span className={task.done ? "text-strike" : ""}>
                      {task.title}
                    </span>
                  </div>
                  <div className="col-2 text-right">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteTask(task._id, index)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form>
            <div className="container row pb-4">
              <div className="col-md-10 col-sm-12 mx-auto mb-3">
                <input
                  onChange={handleTask("project")}
                  value={task}
                  className="form-control"
                  type="text"
                  placeholder="Enter Task Name"
                />
              </div>
              <div className="col-md-2 col-sm-12 mx-auto text-right">
                <button
                  onClick={onTaskSubmit}
                  className="btn btn-success shadow"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* Project Details Modal Ends */}

      {/* Create New Project Modal Starts */}
      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-12 col-sm-12 mx-auto mb-3">
                <input
                  onChange={handleProject("project")}
                  value={project}
                  className="form-control"
                  type="text"
                  placeholder="Enter Project Name"
                />
              </div>
              <div className="col-md-12 col-sm-12 mx-auto text-right">
                <button onClick={onSubmit} className="btn btn-success">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* Create New Project Modal Ends */}
    </Base>
  );
};

export default UserTodos;
