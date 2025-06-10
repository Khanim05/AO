import './App.css'
import { useRoutes } from 'react-router'
import Layout from './components/layout/Layout'
import Home from './pages/home/Home'
import Contact from './pages/contact/Contact'
import About from './pages/about/About'
import Doctor from './pages/doctor/Doctor'
import Profile from './pages/profile/Profile'
import PrivateRoute from './routes/PrivateRoute'
import Appointment from './pages/appointment/Appointment'
import Messages from './pages/messages/Messages'
import Myprofile from './pages/myProfile/Myprofile'
import Setting from './pages/setting/Setting'
import Blog from './pages/blog/Blog'
import Single from './pages/singleBlog/Single'

function App() {
const router=useRoutes([
  {
    path:'/',
    element:<Layout/>,
    children:[
      {path:'',element:<Home/>},
      {path:'about',element:<About/>},
      {path:'contact',element:<Contact/>},
      {path:'doctors',element:<Doctor/>},
      {path:'blog',element:<Blog/>},
      {path:'single/:id',element:<Single/>},
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile/>
          </PrivateRoute>
        ),
      },
       {
        path: 'myprofile',
        element: (
          <PrivateRoute>
            <Myprofile/>
          </PrivateRoute>
        ),
      },
       {
        path: 'settings',
        element: (
          <PrivateRoute>
            <Setting/>
          </PrivateRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <PrivateRoute>
            <Appointment />
          </PrivateRoute>
        ),
      },
      {
        path: 'messages',
        element: (
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        ),
      },
    ]
  }
])
return router
}

export default App
