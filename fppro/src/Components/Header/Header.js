import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userAdminSlice";

function Header() {
  let { loginUserStatus, currentUser } = useSelector(
    (state) => state.userAdminLoginReducer
  );

  let dispatch = useDispatch();

  function signOut() {
    // remove token from local storage
    localStorage.removeItem("token");
    dispatch(resetState());
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-blur">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
        <img src="https://media.licdn.com/dms/image/C560BAQFKt8O5GdaFjw/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=TbOLxNjzU1LYPUoXNYPFMXd3-pUKhPwWyyyFfOBZn08" alt="" className="" style={{'width':'37px'}} />
          <h1 className="navbar-title ms-1">Feedback VNRVJIET</h1>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {loginUserStatus === false ? (
              <li className="nav-item">
                <NavLink className="btn btn-custom me-2 ps-4 pe-4" to="signin">
                  SignIn
                </NavLink>
              </li>
            ) : (
              <li className="nav-item">
                <p className="fs-2 mb-2 me-3">Welcome {currentUser.username},</p>
                <NavLink
                  className="btn btn-custom ps-4 pe-4 mb-1"
                  to="signin"
                  onClick={signOut}
                >
                  Signout
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
