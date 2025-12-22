import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <>
      <Header onToggleSidebar={() => setIsSidebarOpen(v => !v)} />

      <div className="layout-body">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default MainLayout
