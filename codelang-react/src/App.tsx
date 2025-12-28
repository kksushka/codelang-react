import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import MainLayout from './layout/MainLayout'
import Home from './pages/HomePage'
import AccountPage from './pages/AccountPage'
import CreateSnippetPage from './pages/CreateSnippetPage/CreateSnippetPage'
import SnippetPage from './pages/SnippetPage/SnippetPage'
import EditSnippetPage from './pages/EditSnippetPage/EditSnippetPage'
import MySnippetsPage from './pages/MySnippetsPage/MySnippetsPage'
import UsersPage from './pages/UsersPage/UsersPage'
import UserPage from './pages/UserPage/UserPage'
import QuestionsPage from './pages/QuestionsPage/QuestionsPage'
import CreateQuestionPage from './pages/CreateQuestionPage/CreateQuestionPage'
import ProtectedPage from './routes/ProtectedPage'
import Register from './pages/AuthPages/RegisterPage'
import Login from './pages/AuthPages/LoginPage'
import EditQuestionPage from './pages/EditQuestion/EditQuestionPage'

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/account"
            element={
              <ProtectedPage title="Account">
                <AccountPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedPage title="Create snippet">
                <CreateSnippetPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/my-snippets"
            element={
              <ProtectedPage title="My snippets">
                <MySnippetsPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/snippets/:id"
            element={
              <ProtectedPage title="Snippet">
                <SnippetPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/snippets/:id/edit"
            element={
              <ProtectedPage title="Edit snippet">
                <EditSnippetPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedPage title="Users">
                <UsersPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/users/:id"
            element={
              <ProtectedPage title="User profile">
                <UserPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/questions"
            element={
              <ProtectedPage title="Questions">
                <QuestionsPage />
              </ProtectedPage>
            }
          />

          <Route
            path="/questions/create"
            element={
              <ProtectedPage title="Create question">
                <CreateQuestionPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/questions/:id/edit"
            element={
              <ProtectedPage title="Edit question">
                <EditQuestionPage/>
              </ProtectedPage>
            }
          />
          <Route path="*" element={<div>Page not found</div>} />
ё
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
