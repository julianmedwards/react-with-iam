import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getJwt, parseJwt } from '../auth'

function Nav() {
    const jwt = getJwt()
    const navigate = useNavigate()
    const location = useLocation()

    async function handleLogout() {
        localStorage.removeItem('jwt')
        navigate(location.pathname, { replace: true })
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand me-4" to={'/'}>
                        Home
                    </Link>
                    <Link to={'/about'} className="navbar-text me-auto">
                        About
                    </Link>
                    {jwt ? (
                        <>
                            <p className="navbar-text m-0 me-3">
                                {parseJwt(jwt).username}
                            </p>
                            <div
                                onClick={() => {
                                    handleLogout()
                                }}
                                className="navbar-text link me-4"
                            >
                                Logout
                            </div>
                        </>
                    ) : (
                        <Link to={'/login'} className="navbar-text mx-4">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Nav
