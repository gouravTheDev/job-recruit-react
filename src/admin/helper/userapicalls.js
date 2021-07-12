import { API } from "../../backend";

class UserApi {
  jobList = async (token) => {
    try {
      let jobList = await fetch(`${API}/job/list`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
      });
      jobList = await jobList.json();
      return jobList;
    } catch (error) {
      console.log(error);
    }
  };

  jobApplications = async (token, jobId) => {
    try {
      let jobApplications = await fetch(`${API}/job-application/job-list/${jobId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
      });
      jobApplications = await jobApplications.json();
      return jobApplications;
    } catch (error) {
      console.log(error);
    }
  };

  updateJobApplication = async (token, data) => {
    try {
      let jobApplicationRecord = await fetch(`${API}/job-application/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(data),
      });
      jobApplicationRecord = await jobApplicationRecord.json();
      return jobApplicationRecord;
    } catch (error) {
      console.log(error);
    }
  };

  createJob = async (token, data) => {
    try {
      let jobData = await fetch(`${API}/job/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(data),
      });
      jobData = await jobData.json();
      console.log(jobData);
      return jobData;
    } catch (error) {
      console.log(error);
    }
  };

  updateJob = async (token, data) => {
    try {
      let updateJob = await fetch(`${API}/job/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(data),
      });
      updateJob = await updateJob.json();
      return updateJob;
    } catch (error) {
      console.log(error);
    }
  };

  deleteJob = async (token, id) => {
    try {
      let updateJob = await fetch(`${API}/job/delete`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({id: id}),
      });
      updateJob = await updateJob.json();
      return updateJob;
    } catch (error) {
      console.log(error);
    }
  };
}

export default new UserApi();
