import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { JSX } from 'react'

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  return user ? <Navigate to="/" /> : children
}

export default PublicRoute
