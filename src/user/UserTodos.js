import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Modal, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import ProjectHelper from "../core/helper/projectHelper";

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
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Handling Changes

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShowProjectDetails(false);
  const handleShow = () => setShow(true);
  const handleShowProjectDetails = async (projectId) => {
    setTasks([]);
    setProjectDetails({});
    setDetails("");
    setShowProjectDetails(true);
    let proj = {};
    projects.map((project) => {
      if (project._id.toString() == projectId.toString()) {
        setProjectDetails(project);
        proj = project;
      }
    });
    console.log(projectId);
    let token = cookies.get("token");
    let tasks = await ProjectHelper.fetchTasks(token, projectId);
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

  async function fetchProjects() {
    try {
      let token = cookies.get("token");
      setToken(token);
      let response = await ProjectHelper.fetchProjects(token);
      console.log(response.data);
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // Use Effect Method

  useEffect(() => {
    fetchProjects();
  }, []);

  // Execution Methods

  const onSubmit = async (event) => {
    event.preventDefault();
    let existingProjects = projects;
    if (project == "") {
      return;
    }
    let submitProject = await ProjectHelper.createProject(token, project);
    if (submitProject.status == 200) {
      existingProjects.push(submitProject.data);
    } else {
      return;
    }
    setProjects(existingProjects);
    setProject("");
    fetchProjects();
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
    let submitTask = await ProjectHelper.createTask(
      token,
      task,
      projectDetails._id
    );

    setTasks(submitTask.data);

    fetchProjects();
  };

  const updateTask = async (taskId, body, index) => {
    let existingTasks = [...tasks];
    if (body.done) {
      existingTasks[index].done = true;
    } else {
      existingTasks[index].done = false;
    }
    setTasks(existingTasks);
    let updateTask = await ProjectHelper.updateTask(token, taskId, body);
    if (updateTask.status == 200) {
      setTasks(updateTask.data);
    } else {
      return;
    }
    fetchProjects();
  };

  const deleteTask = async (taskId, index) => {
    let existingTasks = [...tasks];
    existingTasks[index].isDeleted = true;
    if (index > -1) {
      existingTasks.splice(index, 1);
    }
    setTasks(existingTasks);
    let updateTask = await ProjectHelper.updateTask(token, taskId, {
      isDeleted: true,
    });
    if (updateTask.status == 200) {
      setTasks(updateTask.data);
    } else {
      return;
    }
    fetchProjects();
  };

  const deleteProject = async (projectId) => {
    if (window.confirm("Delete the Project?")) {
      setShowProjectDetails(false);
      let updateProject = await ProjectHelper.updateProject(token, projectId, {
        isDeleted: true,
      });
      console.log(updateProject)
      if (updateProject.status == 200) {
        setProjects(updateProject.data);
      } else {
        return;
      }
      fetchProjects();
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
    let updateProject = await ProjectHelper.updateProject(
      token,
      projectDetails._id,
      { details: details }
    );
    console.log(updateProject);

    fetchProjects();
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
    <Base title="Listed Projects">
      <div className="text-center mt-0">
        <Button
          variant="primary"
          onClick={handleShow}
          id="addProjectButton"
          className="shadow mt-0"
          style={{ borderRadius: "50%" }}
          title="Add New Project"
        >
          <i className="fa fa-plus" id="plusIcon"></i>
        </Button>
      </div>
      <div className="row">
        {projects.map((project) => (
          <div key={project._id} className="col-md-3 col-sm-12 mb-3">
            <div
              className="card-cus shadow"
              style={{ cursor: "pointer" }}
              onClick={() => handleShowProjectDetails(project._id)}
            >
              <div className="card-body">
                <h4
                  style={{ color: "#000" }}
                  className="text-center font-weight-bold"
                >
                  {project.category}
                </h4>
                <div className="row mt-3">
                  <div className="col-4">
                    <div
                      className="pt-3"
                      style={{ position: "", bottom: "2px", left: "30px" }}
                    >
                      <span style={{ color: "#9E9EA1" }}>
                        <i className="far fa-check-square"></i>{" "}
                        {project.doneTaskCount}/{project.allTaskCount}
                      </span>
                    </div>
                  </div>
                  <div
                    className="col-8 text-right"
                    style={{
                      position: "",
                      bottom: "2px",
                      right: "5px",
                    }}
                  >
                    <div
                      className="pt-3"
                      style={{ position: "", bottom: "2px", right: "30px" }}
                    >
                      <span style={{ color: "#9E9EA1" }}>
                        <i className="far fa-clock"></i>{" "}
                        {moment(project.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
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
