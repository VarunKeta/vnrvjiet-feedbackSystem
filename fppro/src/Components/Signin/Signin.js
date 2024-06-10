import "./Signin.css";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { userAdminLoginThunk } from "../../redux/slices/userAdminSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRadioGroup } from '@mui/material/RadioGroup';
import {RadioGroup} from '@mui/material'
import {Radio} from '@mui/material'
import {FormControlLabel} from '@mui/material'
function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { isPending, currentUser, loginUserStatus, errorOccurred, errMsg } =
    useSelector((state) => state.userAdminLoginReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSignInFormSubmit = (userCred) => {
    console.log(userCred);
    dispatch(userAdminLoginThunk(userCred));
  };

  useEffect(() => {
    if (loginUserStatus) {
      console.log(currentUser);
      if (currentUser.userType === "user") {
        navigate("/user-profile");
      }
      if (currentUser.userType === "admin") {
        navigate("/admin-profile");
      }
    }
  }, [loginUserStatus, currentUser, navigate]);

  return (
    <div className="mt-5">
      <div className="row justify-content-center mt-3 mb-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card box">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Signin</h2>
            </div>
            <div className="card-body">
              {/* Invalid credentials error */}
              {errorOccurred && (
                <p className="text-center" style={{ color: "red" }}>
                  {errMsg}
                </p>
              )}
              <form onSubmit={handleSubmit(onSignInFormSubmit)}>
                {/* Radio buttons */}
                <div className="mb-4">
                <label
                    className="form-check-label me-3 text-primary"
                    style={{ fontSize: "1.2rem", color: "var(--light-dark-grey)" }}
                  >
                    Login as
                  </label>
                <RadioGroup row className="use-radio-group form-check" defaultValue="admin">
                      <FormControlLabel  className="form-check-input me-5" value="admin" label="admin" control={<Radio />} {...register("userType", { required: true })} />
                      <FormControlLabel className="form-check-input ms-5" value="user" label="user" control={<Radio />} {...register("userType", { required: true })} />
                </RadioGroup>
                </div>
                {errors.userType && (
                  <p className="text-danger">Please select a user type</p>
                )}

                {/* Username field */}
                <div className="mb-4">
                  <label htmlFor="username" className="form-label fw-bold">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    {...register("username", { required: true })}
                  />
                  {errors.username && (
                    <p className="text-danger">Username is required</p>
                  )}
                </div>

                {/* Password field */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <p className="text-danger">Password is required</p>
                  )}
                </div>

                <div className="text-end fw-bold">
                  <button type="submit" className="btn btn-success">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
