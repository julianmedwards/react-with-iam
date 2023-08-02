import React from 'react'
import { RenderOptions, render } from '@testing-library/react'

type Options = RenderOptions<
    typeof import('@testing-library/dom/types/queries'),
    HTMLElement,
    HTMLElement
>

const customRender = (ui: React.ReactElement, options?: Options) => {
    return render(ui, { ...options })
}

export * from '@testing-library/react'
export { customRender as render }
