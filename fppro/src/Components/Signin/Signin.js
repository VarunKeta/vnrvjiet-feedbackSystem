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
    <div className="mt-2 containersignin" >
      
      <div className="row justify-content-center mt-3 mb-5">
        <div className="column "  style={{'width':'500px'}}>
          <div className=" box card shadow p-2 ">
            <img src="https://media.licdn.com/dms/image/C560BAQFKt8O5GdaFjw/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=TbOLxNjzU1LYPUoXNYPFMXd3-pUKhPwWyyyFfOBZn08" alt="" className="imag" />
            <h3 className="image headi" style={{'fontSize':'16px'}}>VNR Vignana Jyothi Institute Of</h3>
            <h3 className="image headi" style={{'fontSize':'16px'}}>Engineering And Technology</h3>
            <hr />
            <div className="card-body">
              {/* Invalid credentials error */}
              {errorOccurred && (
                <p className="text-center" style={{ color: "red" }}>
                  {errMsg}
                </p>
              )}
              <form onSubmit={handleSubmit(onSignInFormSubmit)}>
                {/* Radio buttons */}
                <div className="">
                
                <RadioGroup row className="use-radio-group " defaultValue="admin">
                <label
                    className="form-check-label me-3 mt-1 text-primary"
                    style={{ fontSize: "1.2rem", color: "var(--light-dark-grey)" }}
                  >
                    Login as
                  </label>
                      <FormControlLabel  className=" " value="admin" label="admin" control={<Radio />} {...register("userType", { required: true })} />
                      <FormControlLabel className="" value="user" label="user" control={<Radio />} {...register("userType", { required: true })} />
                </RadioGroup>
                </div>
                {errors.userType && (
                  <p className="text-danger">Please select a user type</p>
                )}
               

                {/* Username field */}
                <div className=" field">
                  <label htmlFor="username" className="form-label fw-bold">
                    Username
                  </label>
                  <div className="control">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    {...register("username", { required: true })}
                  />
                  </div>
                  {errors.username && (
                    <p className="text-danger">Username is required</p>
                  )}
                </div>

                {/* Password field */}
                <div className="field">
                  <label htmlFor="password" className="form-label fw-bold">
                    Password
                  </label>
                  <div className="control">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register("password", { required: true })}
                  />
                  </div>
                  {errors.password && (
                    <p className="text-danger">Password is required</p>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <button className="button-18" type="submit" role="button">Login</button>
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
