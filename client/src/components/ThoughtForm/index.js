import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import { ADD_THOUGHT } from "../../utils/mutations";
import { QUERY_THOUGHTS } from "../../utils/queries";

const ThoughtForm = () => {
  const [thoughtText, setText] = useState("");
  const [charCount, setCharacterCount] = useState(0);

  // New thought doesn't appear on the homepage anywhere.
  // If you refresh the page, however, the thought appears at the top of the list,
  // because the client made a new request to the server to get the latest version.
  // This seems to go against what we recently learned about Apollo Client's cache.
  // Why isn't the cache being updated? Why do you need to make a new request
  // to the server to get the update? The Apollo Client tracks cached objects by their IDs.
  // In this case, we've added a new thought that should go inside an array of thoughts,
  // but the array itself has no ID to track.
  // So the only way to get the updated array is to re-request it from the server.
  // We can remedy this problem by manually inserting the new thought object into the cached array.
  // The useMutation Hook can include an update function that allows us to update the cache of any related queries.

  // declare an addThought() function and error variable
  // Remember, the addThought() function will run the actual mutation.
  // The error variable will initially be undefined
  // but can change depending on if the mutation failed.
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    // In the update() function, addThought represents the new thought that was just created.
    // Using the cache object, we can read what's currently saved in the QUERY_THOUGHTS cache
    // and then update it with writeQuery() to include the new thought object.
    update(cache, { data: { addThought } }) {
      // read what's currently in the cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

      // prepend the newest thouhght to the front of the array
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] },
      });
    },
  });

  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  // This function will eventually call a mutation,
  // so we'll define it
  // as an async function ahead of time.
  // Currently, though, it will only clear the form values when the form is submitted.
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add thought to database
      await addThought({
        variables: { thoughtText },
      });

      // clear form value
      setText("");
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <p
        className={`m-0 ${
          charCount === 280 || error ? "text-error" : "text-error"
        }`}
      >
        Character Count: {charCount}/280
        {error && <span className="m-2">Something went wrong...</span>}
      </p>
      <form
        onSubmit={handleFormSubmit}
        className="flex-row justify-center justify-space-between-md align-stretch"
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
