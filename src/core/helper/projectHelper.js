import { API } from "../../backend";

class ProjectHelper {
  createProject = async (token, projectName) => {
    try {
      let projectSaved = await fetch(`${API}/category/store`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ category: projectName }),
      });
      projectSaved = await projectSaved.json();
      return projectSaved;
    } catch (error) {
      console.log(error);
    }
  };

  createTask = async (token, task, projectId) => {
    try {
      let taskSaved = await fetch(`${API}/todo/store`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ title: task, category: projectId }),
      });
      taskSaved = await taskSaved.json();
      return taskSaved;
    } catch (error) {
      console.log(error);
    }
  };

  updateTask = async (token, taskId, taskBody) => {
    try {
      taskBody.todoId = taskId;
      let taskUpdated = await fetch(`${API}/todo/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(taskBody),
      });
      taskUpdated = await taskUpdated.json();
      return taskUpdated;
    } catch (error) {
      console.log(error);
    }
  };

  updateProject = async (token, projectId, projectBody) => {
    try {
      projectBody.categoryId = projectId;
      let taskUpdated = await fetch(`${API}/category/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(projectBody),
      });
      taskUpdated = await taskUpdated.json();
      return taskUpdated;
    } catch (error) {
      console.log(error);
    }
  };

  fetchProjects = async (token) => {
    try {
      let projects = await fetch(`${API}/category/list`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      projects = await projects.json();
      return projects;
    } catch (error) {
      console.log(error);
    }
  };

  fetchTasks = async (token, projectId) => {
    try {
      let tasks = await fetch(`${API}/todo/list/${projectId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      tasks = await tasks.json();
      return tasks;
    } catch (error) {
      console.log(error);
    }
  };
}

export default new ProjectHelper();
