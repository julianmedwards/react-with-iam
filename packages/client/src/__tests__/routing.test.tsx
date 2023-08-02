import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render, screen } from './test-utils'
import userEvent from '@testing-library/user-event'
import { routeObject } from '../App'

test('the api url env var is set', async () => {
    expect(import.meta.env.VITE_API_URL).not.toBeUndefined()
})

afterEach(() => {
    localStorage.removeItem('jwt')
})

describe('React Router Navigation', () => {
    test('loads root page', async () => {
        render(<RouterProvider router={createMemoryRouter(routeObject)} />)

        expect(
            await screen.findByText('Log in to view this info!')
        ).toBeInTheDocument()
    })

    test('navigates from root to about page', async () => {
        const user = userEvent.setup()

        render(<RouterProvider router={createMemoryRouter(routeObject)} />)

        expect(
            await screen.findByText('Generic Information')
        ).toBeInTheDocument()

        user.click(await screen.findByText('About'))

        expect(
            await screen.findByText('About this project')
        ).toBeInTheDocument()
    })
})
