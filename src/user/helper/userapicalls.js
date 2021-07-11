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

  applyJob = async (token, data) => {
    try {
      let jobApplication = await fetch(`${API}/job-application/apply`, {
        method: "POST",
        headers: {
          token: token,
        },
        body: data,
      });
      jobApplication = await jobApplication.json();
      return jobApplication;
    } catch (error) {
      console.log(error);
    }
  };

  jobApplications = async (token) => {
    try {
      let jobApplications = await fetch(`${API}/job-application/my-list`, {
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
}

export default new UserApi();
