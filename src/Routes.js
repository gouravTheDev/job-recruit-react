import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import UserJobList from "./user/job/JobList";
import UserJobApplicationList from "./user/job-application/UserJobApplicationList";

import AdminJobList from "./admin/job/JobList";
import AdminJobApplicationList from "./admin/job-application/AdminJobApplicationList";

// import AdminJobList from "./admin/job/list";
// import AdminJobApplicationList from "./admin/job-application/list";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        {/* <Route path="/profile" exact component={Profile} /> */}
        <PrivateRoute path="/user/job/list" exact component={UserJobList} />
        <PrivateRoute path="/user/job-application/list" exact component={UserJobApplicationList} />

        <PrivateRoute path="/admin/job/list" exact component={AdminJobList} />
        <PrivateRoute path="/admin/job-application/:id" exact component={AdminJobApplicationList} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
