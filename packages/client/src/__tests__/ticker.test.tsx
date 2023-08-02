import { render, screen } from './test-utils'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routeObject } from '../App'

// Runs against local, dev database. Assumes the following users exist:
// [
//     {username: 'julian', password: 'password'}
// ]

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => {
    localStorage.removeItem('jwt')
    server.resetHandlers()
})
afterAll(() => server.close())

describe('Incrementing ticker', () => {
    test('will redirect to login if auth fails', async () => {
        const user = userEvent.setup()

        server.use(
            rest.patch(
                `${import.meta.env.VITE_API_URL}/api/users/:userId/ticker`,
                (_req, res, ctx) => {
                    return res(ctx.status(401))
                }
            )
        )

        render(<RouterProvider router={createMemoryRouter(routeObject)} />)

        await user.click(await screen.findByRole('link', { name: /login/i }))

        expect(
            await screen.findByRole('button', { name: /sign in/i })
        ).toBeInTheDocument()

        await user.type(await screen.findByLabelText(/username/i), 'julian')
        await user.type(await screen.findByLabelText(/password/i), 'password')

        await user.click(
            await screen.findByRole('button', { name: /sign in/i })
        )

        await user.click(
            await screen.findByRole('button', { name: /increase ticker/i })
        )

        expect(
            await screen.findByRole('button', { name: /sign in/i })
        ).toBeInTheDocument()
    })
})
