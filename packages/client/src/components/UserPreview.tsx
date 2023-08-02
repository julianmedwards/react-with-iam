import { Button } from 'react-bootstrap'
import { useRouteLoaderData, useFetcher } from 'react-router-dom'
import { type RootLoaderData } from '../routes/Root'
import { getJwt, parseJwt } from '../auth'

function UserPreview() {
    const fetcher = useFetcher()
    const jwt = getJwt()
    const rootData = useRouteLoaderData('root') as RootLoaderData

    return (
        <div className="col col-3">
            <h2>Private Information</h2>
            {jwt && rootData ? (
                <ul className="list-group my-2">
                    <li className="list-group-item">
                        Your username: {parseJwt(jwt).username}
                    </li>
                    <li className="list-group-item">
                        Ticker: {rootData.tickerValue}
                    </li>
                    <fetcher.Form
                        method="post"
                        action={`/users/${parseJwt(jwt).id}/ticker`}
                    >
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-2"
                        >
                            Increase Ticker
                        </Button>
                    </fetcher.Form>
                </ul>
            ) : (
                <h4>Log in to view this info!</h4>
            )}
        </div>
    )
}

export default UserPreview
