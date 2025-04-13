import { Navigate, Route, Routes } from "react-router-dom"
import "./index.css"
import Layout from "./components/Layout"
import SigninPage from "./components/templates/authentication/SigninPage"
import ForgetPassPage from "./components/templates/authentication/ForgetPasswordPage"
import AcceptPage from "./components/templates/authentication/AcceptPage"
import Cookies from "js-cookie"
import BookCategoryPage from "./components/templates/pages/BookCategoryPage"
import Dashboard from "./components/templates/pages/Dashboard"
import BookListPage from "./components/templates/pages/BookListPage"
import ChaptersPage from "./components/templates/pages/ChaptersPage"
import CommentsPage from "./components/templates/pages/CommentsPage"

const token = Cookies.get("authToken")

const Authorized = ({ element }) => {
  return token !== undefined ? <Navigate replace to="/dashboard" /> : element
}

const UnAuthorized = ({ element }) => {
  return token !== undefined ? element : <Navigate replace to="/signin" />
}

function App() {
  return (
    <Routes>
      {/* Pages accessible without login */}
      <Route path="/signin" element={<Authorized element={<SigninPage />} />} />
      <Route
        path="/forgetPass"
        element={<Authorized element={<ForgetPassPage />} />}
      />
      <Route path="/accept" element={<Authorized element={<AcceptPage />} />} />

      {/* Pages accessible only when logged in, wrapped with Layout */}
      <Route
        path="/*"
        element={
          <UnAuthorized
            element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/bookcategories"
                    element={<BookCategoryPage />}
                  />
                  <Route path="/bookslist" element={<BookListPage />} />
                  <Route path="/chapters/:id" element={<ChaptersPage />} />
                  <Route path="/comments" element={<CommentsPage />} />
                </Routes>
              </Layout>
            }
          />
        }
      />
    </Routes>
  )
}

export default App
