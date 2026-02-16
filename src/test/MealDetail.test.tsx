import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MealDetail from '../MealDetail'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('MealDetail Component', () => {
  const mockMeal = {
    strMeal: 'Chicken Curry',
    strMealThumb: 'https://example.com/chicken.jpg',
    strInstructions: 'Cook the chicken with curry spices...'
  }

  it('debe renderizar los detalles de la comida', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/meal', state: mockMeal }]}>
        <Routes>
          <Route path="/meal" element={<MealDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Chicken Curry')).toBeInTheDocument()
    expect(screen.getByText(/Cook the chicken with curry spices/i)).toBeInTheDocument()
    expect(screen.getByAltText('Chicken Curry')).toBeInTheDocument()
  })

  it('debe renderizar el botón de volver', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/meal', state: mockMeal }]}>
        <Routes>
          <Route path="/meal" element={<MealDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Volver')).toBeInTheDocument()
  })

  it('debe llamar a navigate cuando se hace clic en volver', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/meal', state: mockMeal }]}>
        <Routes>
          <Route path="/meal" element={<MealDetail />} />
        </Routes>
      </MemoryRouter>
    )

    const backButton = screen.getByText('Volver')
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('debe mostrar mensaje cuando no hay datos', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/meal', state: undefined }]}>
        <Routes>
          <Route path="/meal" element={<MealDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('No hay datos')).toBeInTheDocument()
    expect(screen.getByText('Volver al inicio')).toBeInTheDocument()
  })

  it('debe navegar al inicio cuando no hay datos y se hace clic en el botón', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/meal', state: undefined }]}>
        <Routes>
          <Route path="/meal" element={<MealDetail />} />
        </Routes>
      </MemoryRouter>
    )

    const backButton = screen.getByText('Volver al inicio')
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('debe renderizar la imagen correctamente', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/meal', state: mockMeal }]}>
        <Routes>
          <Route path="/meal" element={<MealDetail />} />
        </Routes>
      </MemoryRouter>
    )

    const image = screen.getByAltText('Chicken Curry') as HTMLImageElement
    expect(image.src).toBe('https://example.com/chicken.jpg')
  })
})