import { useState } from 'react'
import {
    Form,
    Link,
    Navigate,
    useActionData,
    ActionFunctionArgs,
    redirect,
} from 'react-router-dom'
import { getJwt, requestAuth } from '../auth'

export async function loginAction({ request }: ActionFunctionArgs) {
    const response = await requestAuth(
        await request.formData(),
        '/login/password'
    )

    if (response.ok) {
        const resData = await response.json()
        localStorage.setItem('jwt', resData.jwt)
        return redirect('/')
    } else if (response.status === 400) {
        return new Response('Incorrect username or password.', response)
    } else {
        return new Response('There was an issue logging in.', response)
    }
}

function Login() {
    const jwt = getJwt()
    const authResponse = useActionData()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const loginScreen = (
        <main className="container">
            <section className="text-center">
                <h3>Sample App</h3>
                <h1>Sign in</h1>
                {typeof authResponse === 'string' && (
                    <section className="text-danger">
                        <p className="m-0">{authResponse}</p>
                    </section>
                )}
                <Form
                    method="post"
                    className="row row-cols-1 justify-content-center"
                >
                    <div className="col-3">
                        <section className="m-2 d-flex justify-content-between">
                            <label htmlFor="username">Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                autoFocus
                            />
                        </section>
                        <section className="m-2 d-flex justify-content-between">
                            <label htmlFor="current-password">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="current-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                            />
                        </section>
                        <button type="submit" className="m-2">
                            Sign in
                        </button>
                    </div>
                </Form>
                <hr />
                <p className="fst-italic">
                    Don't have an account?{' '}
                    <Link to={'/signup'} replace={true}>
                        Sign up
                    </Link>
                </p>
            </section>
        </main>
    )

    return jwt ? <Navigate to="/" replace={true} /> : loginScreen
}

export default Login
