import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('App Component - Routing', () => {
  it('debe renderizar Home en la ruta raíz', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Meal Finder')).toBeInTheDocument()
  })

  it('debe renderizar MealDetail en la ruta /meal con datos', () => {
    const mockMeal = {
      strMeal: 'Test Meal',
      strMealThumb: 'https://example.com/test.jpg',
      strInstructions: 'Test instructions'
    }

    render(
      <MemoryRouter initialEntries={[{ pathname: '/meal', state: mockMeal }]}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Test Meal')).toBeInTheDocument()
  })

  it('debe renderizar mensaje de error en /meal sin datos', () => {
    render(
      <MemoryRouter initialEntries={['/meal']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('No hay datos')).toBeInTheDocument()
  })
})