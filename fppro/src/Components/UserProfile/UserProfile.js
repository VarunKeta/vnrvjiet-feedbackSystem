import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from "react-router-dom";
import Alumini from "../Forms/Alumini/Alumini";
import Faculty from "../Forms/Faculty/Faculty";
import Industry from "../Forms/Industry/Industry";
import Lab from "../Forms/Student/Lab/Lab";
import Parent from "../Forms/Parent/Parent";
import { useSelector,useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userAdminSlice";
import Professional from "../Forms/Professional/Professional";
import Department from '../Forms/Graduate_exit/Department/Department';
import Theory from '../Forms/Student/Theory/Theory';
function UserProfile() {
    let { loginUserStatus, errorOccurred, errMsg,currentUser } = useSelector(
        (state) => state.userAdminLoginReducer
      );
      let dispatch=useDispatch()
      const [userType2, setuserType2] = useState(null)
      function signOut(){
        //remove token from local storage
        localStorage.removeItem('token')
        dispatch(resetState())
      }
      useEffect(() => {
        // Ensure currentUser and currentUser.username are available
    
        const requestBody = JSON.stringify({ username: currentUser.username });
    
        fetch('http://localhost:5000/user-api/getusertype/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok: ' + res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.payload) {
            setuserType2(data.payload);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      }, [currentUser]);
      console.log(userType2)
  return (
   /* <>

    <NavLink to='articles' className='fs-3 text-primary nav-link  p-2 text-center mt-2' style={{'backgroundColor': '#e3f2fd'}}>Articles</NavLink>
    <Outlet />
    </>*/
    <div>
    
    {userType2 === "alumni" ? (
        <>
          <Alumini/>
        </>
      ) : userType2 === "student" ? (
        <>
       <Theory/>
        </>
      ) : userType2==="faculty" ?  (
        <>
        <Faculty/>
        </>
      ) : userType2==="graduate_exit" ?  (
        <>
        <Department/>
        </>
      ) : userType2==="parent" ?  (
        <>
       <Parent/>
        </>
      ) : userType2==="professional" ?  (
        <>
        <Professional/>
        </>
      ) : (
        <>
        <Industry/>
        </>
      )
    }
      </div>
)}

export default UserProfile;