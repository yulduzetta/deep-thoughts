import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import { ADD_REACTION } from "../../utils/mutations";

const ReactionForm = ({ thoughtId }) => {
  const [reactionBody, setBody] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [addReaction, { error }] = useMutation(ADD_REACTION);

  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setBody(event.target.value);
      setCharCount(event.target.value.length);
    }
  };

  // Submitting a reaction should automatically display the new reaction on the Single Thought page.
  // Updating the cache works seamlessly, because the mutation returns the parent thought object that includes the updated reactions array as a property.
  // If the mutation returned the reaction object instead, then we'd have another situation in which the cache would need a manual update.
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await addReaction({
        variables: { thoughtId, reactionBody },
      });
      // clean up
      setBody("");
      setCharCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <p className="m-0">
        Character Count: {charCount}/280
        {error && <span className="m-2">Something went wrong...</span>}
      </p>
      <form className="flex-row justify-center justify-space-between-md align-stretch">
        <textarea
          onChange={handleChange}
          placeholder="Leave a reaction to this thought..."
          className="form-input col-12 col-md-9"
        ></textarea>

        <button
          onClick={handleFormSubmit}
          value={reactionBody}
          className="btn col-12 col-md-3"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReactionForm;
