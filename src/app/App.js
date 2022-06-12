import React, { lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import { CssBaseline } from "@material-ui/core";

import { Home } from "../pages/Home";

const PageNotFound = lazy(() => import("../pages/PageNotFound"));

export const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          {/* <Route path="/resume" component={Resume} /> */}
          <Route path="*" component={PageNotFound} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};
