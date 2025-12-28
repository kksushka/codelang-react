import type { JSX } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthStub from '../components/AuthStub/AuthStub'

interface Props {
  children: JSX.Element
  title?: string
}

const ProtectedPage = ({ children, title }: Props) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) {
    return (
      <AuthStub
        title={title}
        description="Please log in to access this page."
      />
    )
  }

  return children
}

export default ProtectedPage
