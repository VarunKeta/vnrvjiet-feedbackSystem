//import logo from './logo.svg';
// import './App.css';
import Alumini from './Components/Forms/Alumini/Alumini';
import 'bootstrap/dist/css/bootstrap.css';
import Faculty from './Components/Forms/Faculty/Faculty';
import Industry from './Components/Forms/Industry/Industry';
import Professional from './Components/Forms/Professional/Professional';
import Lab from './Components/Forms/Student/Lab/Lab';
import Department from './Components/Forms/Graduate_exit/Department/Department';
import Institution from './Components/Forms/Graduate_exit/Institution/Institution'
import CreateUser from './Components/Admin/CreateUser/CreateUser';
import Signin from './Components/Signin/Signin';
import {createBrowserRouter,Navigate,RouterProvider} from 'react-router-dom'
import Rootlayout from './Components/Rootlayout/Rootlayout';
import UserProfile from './Components/UserProfile/UserProfile';
import ErrorPage from './Components/ErrorPage';
import AdminProfile from './Components/AdminProfile/AdminProfile';
import UpdateUser from './Components/Admin/UpdateUser/UpdateUser';
import RetrieveUser from './Components/Admin/RetrieveUser/RetrieveUser'
import DeleteUser from './Components/Admin/DeleteUser/DeleteUser'
import CreateForm from './Components/Admin/CreateForm/CreateForm';
import EditForm from './Components/Admin/EditForm/EditForm';
import Graduate_exit from './Components/Forms/Graduate_exit/Graduate_exit';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import PieCharts from './Components/Admin/Dashboard/PieCharts';
import ChooseStake from './Components/Admin/Dashboard/ChooseStake';
import Theory from './Components/Forms/Student/Theory/Theory';
function App() {
  let router=createBrowserRouter([
    {
      path:'',
      element:<Rootlayout/>,
     errorElement:<ErrorPage/>,
      children:[
        {
          path:'',
          element:<Signin/>
        },
        {
          path:'signin',
          element:<Signin/>
        }
        ,{
         path:"/user-profile",
         element:<UserProfile/>,
         children:[
           {
             path:"alumni",
             element:<Alumini/>
           },
           {
            path:"department",
            element:<Department/>
          },
          {
            path:"graduate",
            element:<Graduate_exit/>
          },
          {
            path:"theory",
            element:<Theory/>
          }
         ]
       },
       {
        path:"/institution",
        element:<Institution/>
      },
      {
        path:"/laboratory",
        element:<Lab/>
      },
       {
         path:"/admin-profile",
         element:<AdminProfile/>,
         children:[
          {
            path:'',
            element:<ChooseStake/>
          },
           {
             path:'create-user',
             element:<CreateUser/>
           },
           {
            path:'update-user',
            element:<UpdateUser/>
          },
          {
            path:'retrieve-user',
            element:<RetrieveUser />
          },
          {
            path:'delete-user',
            element:<DeleteUser/>
          },
          {
            path:'create-form',
            element:<CreateForm/>
          },
          {
            path:'edit-form',
            element:<EditForm/>
          },
          {
            path:'choosestake',
            element:<ChooseStake/>
          },
          {
            path:'dashboard',
           element:<Dashboard/>
          },
          {
            path:'piecharts',
           element:<PieCharts/>
          }
          
         ]
       }
      ]

    }
    
   ])
  return (
    <div>
      
          {/* <Alumini/> */}
          {/* <Industry/> */}
        {/* <Faculty/> */}
        {/* <Professional/> */}
        {/* <Lab/> */}
        {/* <CreateUser/> */}
        {/* <Signin/> */}
     {/* provide BrowserRouter obj to application */}
    <RouterProvider router={router}/>
    </div>
  );
}

export default App;


