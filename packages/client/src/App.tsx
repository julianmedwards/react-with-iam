import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import About from './routes/About'
import Home from './routes/Home'
import Login, { loginAction } from './routes/Login'
import Root, { RootLoader, increaseTickerAction } from './routes/Root'
import Signup, { signupAction } from './routes/Signup'

export const routeObject = [
    {
        path: '/',
        id: 'root',
        element: <Root />,
        loader: RootLoader,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: '/about',
                element: <About />,
            },
            {
                path: '/login',
                element: <Login />,
                action: loginAction,
            },
            {
                path: '/signup',
                element: <Signup />,
                action: signupAction,
            },
            {
                path: '/users/:userId/ticker',
                action: increaseTickerAction,
            },
        ],
    },
]

function App() {
    return <RouterProvider router={createBrowserRouter(routeObject)} />
}

export default App
