// This component, Redirect, will allow us to redirect the user
// to another route within the application.
// Think of it like how we've used location.replace() in the past,
// but it leverages React Router's ability to not reload the browser!

// You'll want to use Link or NavLink in almost all use cases.
// Redirect comes in handy in specific situations though,
// an example is when a 404 page is rendered when the user tries to access
// an undefined route. The Redirect will redirect the user from the 404 route
// to a new route of your choosing, and then replace
// the last entry in the history stack with the redirected route.
// This means that the user will not be able to hit their browser's back button,
// and return to the 404 route.
import { Redirect, useParams } from "react-router-dom";

import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";
import { ADD_FRIEND } from "../utils/mutations";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

const Profile = () => {
  // Returns an object of the params for the route rendered.
  // we get it from the URL bar
  const { username: userParam } = useParams();

  // Now if there's a value in userParam that we got from the URL bar,
  // we'll use that value to run the QUERY_USER query.
  // If there's no value in userParam, like if we simply visit /profile as a logged-in user,
  // we'll execute the QUERY_ME query instead.
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  // Remember, when we run QUERY_ME, the response will return with our data in the me property;
  // but if it runs QUERY_USER instead, the response will return with our data in the user property.
  // Now we have it set up to check for both.
  const user = data?.me || data?.user || {};

  const [addFriend] = useMutation(ADD_FRIEND);

  // if the user is logged in and if so, if the username stored
  // in the JSON Web Token is the same as the userParam value.
  // If they match, we return the <Redirect> component with the prop to set to the value /profile,
  // which will redirect the user away from this URL and to the /profile route.
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use navigation links above to
        sign up or log in!
      </h4>
    );
  }

  // In this case, the addFriend() mutation returns an updated user object
  // whose ID matches the me object already stored in cache.
  // When the cache is updated, the useQuery(QUERY_ME_BASIC) Hook on the homepage causes a re-render.
  const handleClick = async () => {
    try {
      await addFriend({
        variables: {
          id: user._id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* Now if userParam doesn't exist, we'll get a message saying "Viewing your profile." 
          Otherwise, it will display the username of the other user on their profile. */}
          Viewing {userParam ? `${user.username}'s` : "your"} profile
        </h2>

        {/* With these changes, the userParam variable is only defined 
        when the route includes a username (e.g., /profile/Marisa86). 
        Thus, the button won't display when the route is simply /profile. */}
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
