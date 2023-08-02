import Nav from '../components/Nav'

function About() {
    return (
        <>
            <Nav />
            <main>
                <h1>About this project</h1>
                <p>
                    Here's some general information about the app, how it works
                    and why it was made.
                </p>
                <h4>Maybe a FAQ</h4>
                <ul>
                    <li>
                        <h5>Question 1:</h5>
                        <p>Answer 1</p>
                    </li>
                    <li>
                        <h5>Question 2:</h5>
                        <p>Answer 2</p>
                    </li>
                    <li>
                        <h5>Question 3:</h5>
                        <p>Answer 3</p>
                    </li>
                </ul>
            </main>
        </>
    )
}

export default About
