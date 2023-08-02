import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render, screen } from './test-utils'
import userEvent from '@testing-library/user-event'
import { routeObject } from '../App'

// Runs against local, dev database. Assumes the following users exist:
// [
//     {username: 'julian', password: 'password'}
// ]

afterEach(() => {
    localStorage.removeItem('jwt')
})

describe('Basic Auth Flow', () => {
    describe('Logging in', () => {
        test('logs in with good credentials', async () => {
            const user = userEvent.setup()

            render(<RouterProvider router={createMemoryRouter(routeObject)} />)

            expect(
                await screen.findByText('Generic Information')
            ).toBeInTheDocument()

            await user.click(
                await screen.findByRole('link', { name: /login/i })
            )

            expect(
                await screen.findByRole('button', { name: /sign in/i })
            ).toBeInTheDocument()

            await user.type(await screen.findByLabelText(/username/i), 'julian')
            await user.type(
                await screen.findByLabelText(/password/i),
                'password'
            )

            await user.click(
                await screen.findByRole('button', { name: /sign in/i })
            )

            expect(
                await screen.findByText('Generic Information')
            ).toBeInTheDocument()
            expect(await screen.findByText('julian')).toBeInTheDocument()
        })

        test("doesn't allow logging in with wrong password", async () => {
            const user = userEvent.setup()

            render(<RouterProvider router={createMemoryRouter(routeObject)} />)

            expect(
                await screen.findByText('Generic Information')
            ).toBeInTheDocument()

            await user.click(
                await screen.findByRole('link', { name: /login/i })
            )

            expect(
                await screen.findByRole('button', { name: /sign in/i })
            ).toBeInTheDocument()

            await user.type(await screen.findByLabelText(/username/i), 'julian')
            await user.type(
                await screen.findByLabelText(/password/i),
                'wrongpassword'
            )

            await user.click(
                await screen.findByRole('button', { name: /sign in/i })
            )

            expect(
                await screen.findByText('Incorrect username or password.')
            ).toBeInTheDocument()
        })
    })

    describe('Signing up', () => {
        test("doesn't allow signing up with existing username", async () => {
            const user = userEvent.setup()

            render(<RouterProvider router={createMemoryRouter(routeObject)} />)

            expect(
                await screen.findByText('Generic Information')
            ).toBeInTheDocument()

            await user.click(
                await screen.findByRole('link', { name: /login/i })
            )

            await user.click(
                await screen.findByRole('link', { name: /sign up/i })
            )

            await expect(screen.findByRole('link', { name: /sign in/i }))
                .toBeInTheDocument

            await user.type(await screen.findByLabelText(/username/i), 'julian')
            await user.type(
                await screen.findByLabelText(/password/i),
                'anypassword'
            )

            await user.click(
                await screen.findByRole('button', { name: /sign up/i })
            )

            expect(
                await screen.findByText('Username already in use.')
            ).toBeInTheDocument()
        })
    })
})
