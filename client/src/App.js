import React from "react";
// special type of React component that we'll use to provide data to all of the other components
import { ApolloProvider } from "@apollo/react-hooks";

// BrowserRouter and Route are components that the React Router library provides.
// We renamed BrowserRouter to Router to make it easier to work with.
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

// get that data when we're ready to use i
import ApolloClient from "apollo-boost";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";

// initialize the connection
const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("id_token");

    // With this request configuration, we use the .setContext() method to set the
    // HTTP request headers of every request to include the token,
    // whether the request needs it or not.
    // This is fine, because if the request doesn't need the token, our server-side resolver function won't check for it.
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },

  // Uniform Resource Identifier
  uri: "/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      {/* wrapping the <div className="flex-column justify-flex-start min-100-vh">
      makes all of the child components on the page aware of the client-side routing that can take place now. */}
      <Router>
        {/* Because we're passing the client variable in as the value for the client prop in the provider, 
      everything between the JSX tags will eventually have access to the server's API data through the client we set up. */}
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            {/* We've wrapped all of the Route components in a Switch component and included one more Route at the end to render the NoMatch component. If the route doesn't match any of the preceding paths (e.g., /about), then users will see the 404 message.
             */}
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              {/* The ? means this parameter is optional, so /profile and /profile/myUsername will both render the Profile component */}
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />
              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
