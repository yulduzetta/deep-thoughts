import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  // You might initially think this is immediately executing the ADD_USER mutation,
  // just as useQuery() would. Instead, the useMutation() Hook creates
  // and prepares a JavaScript function that wraps around our mutation code
  // and returns it to us. In our case, it returns in the form of the addUser function that's returned.
  // We also get the ability to check for errors.

  // What's the term used for executing a function that scopes data
  // to a new function and returns it to run at a later time? -- A closure.
  const [addUser, { error }] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Remember that the ... in this context is being used as the spread operator.
    // This means that we are setting the variables field in our mutation to be an object
    // with key/value pairs that match directly to what our formState object looks like.
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // use try/catch insteadd of promises to handle errors
    // We use the try...catch block functionality here, as it is especially useful
    // with asynchronous code such as Promises. This way, we can use async/await
    // instead of .then() and .catch() method-chaining while still being able to handle any errors that may occur.
    try {
      // executte addUser mutation and pass in variable data from form
      const { data } = await addUser({
        variables: { ...formState },
      });
      Auth.login(data.addUser.token);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-md-6">
        <div className="card">
          <h4 className="card-header">Sign Up</h4>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <input
                className="form-input"
                placeholder="Your username"
                name="username"
                type="username"
                id="username"
                value={formState.username}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
              />
              <button className="btn d-block w-100" type="submit">
                Submit
              </button>
            </form>
            {error && <div>Sign up failed</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
