import Nav from '../components/Nav'
import UserPreview from '../components/UserPreview'

function Home() {
    return (
        <>
            <Nav />
            <main className="container text-center">
                <div className="row justify-content-around p-4">
                    <div className="col col-5">
                        <h1>Generic Information</h1>
                        <div className="text-start">
                            <p>
                                This is a homepage. There's various information
                                here and you'll always see this section of
                                public content.
                            </p>
                            <p>
                                The next section will only show information if
                                you're logged in as it's private and connected
                                to a user.
                            </p>
                            <p>Click the link in the top right to log in.</p>
                        </div>
                    </div>
                    <UserPreview />
                </div>
            </main>
        </>
    )
}

export default Home
