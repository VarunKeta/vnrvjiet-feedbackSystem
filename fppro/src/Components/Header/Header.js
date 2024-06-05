import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userAdminSlice";
import { ImBlogger2 } from "react-icons/im";

function Header() {
  let { loginUserStatus, errorOccurred, errMsg,currentUser } = useSelector(
    (state) => state.userAdminLoginReducer
  );

  let dispatch=useDispatch()

    function signOut(){
      //remove token from local storage
      localStorage.removeItem('token')
      dispatch(resetState())
    }

  return (

    <nav className="navbar navbar-expand-lg navbar text-light border-body" style={{ 'backgroundColor': 'black', 'color': 'white' }}>
    <div className="container-fluid">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
      <h1>Feedback VNRVJIET</h1>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0"> {/* Adjusted alignment here with ms-auto */}
        <li className="nav-item me-5 text-light">
                <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fblogging%2F&psig=AOvVaw2QOKnxphenlN9pQuySzpfh&ust=1710958312981000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKCu3MX2gIUDFQAAAAAdAAAAABAK"  alt="" />
              </li>
          {loginUserStatus === false ? (
            <>
              <li className="nav-item">
                <button className="btn btn-outline-primary me-2 ps-4 pe-4">
                  <NavLink className="nav-link text-light" to="signin">
                    SignIn
                  </NavLink>
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item text-light">
              <p className="fs-2 mb-2 me-3">Welcome {currentUser.username},</p>
              <button className="btn btn-outline-primary  ps-4 pe-4 mb-1" style={{'marginLeft':'40%'}}>
                <NavLink
                  className="nav-link text-light"
                  to="signin"
                  onClick={signOut}
                >
                  Signout
                </NavLink>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  </nav>

  );
}

export default Header;

