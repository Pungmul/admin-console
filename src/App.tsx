import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/core/components/ProtectedRoute'
import Login from '@/features/auth/ui/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<div>대시보드</div>} />
                  <Route path="/users" element={<div>가입 유저 목록</div>} />
                  <Route path="/users/sanctions" element={<div>유저 제재 관리</div>} />
                  <Route path="/posts/reported" element={<div>신고 누적 게시물</div>} />
                  <Route path="/posts" element={<div>일반 게시글 조회</div>} />
                  <Route path="/notices" element={<div>공지사항</div>} />
                </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
