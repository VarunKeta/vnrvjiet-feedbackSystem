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
import CreateUser from '../Admin/CreateUser/CreateUser';
import UpdateUser from '../Admin/UpdateUser/UpdateUser';
import RetrieveUser from '../Admin/RetrieveUser/RetrieveUser';
import DeleteUser from '../Admin/DeleteUser/DeleteUser';
import CreateForm from '../Admin/CreateForm/CreateForm';
function AdminProfile() {
    let { loginUserStatus, errorOccurred, errMsg,currentUser } = useSelector(
        (state) => state.userAdminLoginReducer
      );
  return (
   /* <>

    <NavLink to='articles' className='fs-3 text-primary nav-link  p-2 text-center mt-2' style={{'backgroundColor': '#e3f2fd'}}>Articles</NavLink>
    <Outlet />
    </>*/
    <div>
    {/* <CreateUser/> */}
    {/* <UpdateUser/> */}
    {/* <RetrieveUser/> */}
    {/* <DeleteUser/> */}
    {/* <CreateUser/> */}
    <CreateForm/>
    {/* {userType2 === "alumni" ? (
        <>
          <Alumini/>
        </>
      ) : userType2 === "student" ? (
        <>
        <Lab/>
        </>
      ) : userType2==="faculty" ?  (
        <>
        <Faculty/>
        </>
      ) : userType2==="graduate" ?  (
        <>
        <Faculty/>
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
    } */}
      </div>
)}

export default AdminProfile;