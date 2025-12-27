import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import MainLayout from './layout/MainLayout'
import Home from './pages/HomePage'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import CreateSnippetPage from './pages/CreateSnippetPage/CreateSnippetPage'
import SnippetPage from './pages/SnippetPage'
import EditSnippetPage from './pages/EditSnippetPage/EditSnippetPage'
import MySnippetsPage from './pages/MySnippetsPage/MySnippetsPage'
import UsersPage from './pages/UsersPage/UsersPage'
import UserPage from './pages/UserPage/UserPage'

const App = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/snippets/:id" element={<SnippetPage />} />
          <Route path="/snippets/:id/edit" element={<EditSnippetPage />} />

          <Route path="/account" element={<AccountPage />} />
          <Route path="/create" element={<CreateSnippetPage />} />
          <Route path="/my-snippets" element={<MySnippetsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<div>Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App