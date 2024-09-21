import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ActivitiesContext = createContext();

/* Activities
1. Send Friend request to a user
2. Accept Friend request from a user
3. UnFriend a user

4. Create a new post
5. Delete a post
6. Like a post
7. Comment on a post
8. Share a post

6. Message a user
7. Delete a message


8. Update profile
  - 8.1 Update profile picture
  - 8.2 Update cover picture
  - 8.3 Update name
  - 8.4 Update bio
  - 8.5 Update location
  - 8.6 Update website
  - 8.7 Update birthday
  - 8.8 Update gender

9. Update account settings
  - 8.6 Update phone number
  - 8.7 Update username
  - 8.8 Update email
  - 8.9 Update password


10. Delete a comment

12. Delete a friend request

14. 
*/

const Activitytypes = [

]


// Activities component
export const ActivitiesContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [Activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/activities/${currentUser.id}`
        );
        setActivities(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchActivities();
  }, [currentUser.id]);

  const logActivity = async (activity) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/activities/",
        activity
      );
      setActivities([...Activities, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteActivity = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/activities/${id}`);
      setActivities(Activities.filter((activity) => activity.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ActivitiesContext.Provider
      value={{ Activities, setActivities, logActivity, deleteActivity }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};
