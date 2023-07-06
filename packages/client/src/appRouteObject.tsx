import { RouteObject } from 'react-router-dom'
import Root, { rootLoader } from './routes/Root'
import ErrorPage from './ErrorPage'
import Home from './routes/Home'
import About from './routes/About'

export const routeObject: RouteObject = {
    path: '/',
    id: 'root',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
        {
            index: true,
            element: <Home />,
        },
        {
            path: '/about',
            element: <About />,
        },
    ],
}
