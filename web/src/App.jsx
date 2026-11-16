import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router"
import MainLayout from "./Components/MainLayout"
import HomePage from "./Pages/HomePage"
import LoginPage from "./Pages/LoginPage"
import { AuthProvider, useAuth } from "./Contexts/AuthContext"
import { useEffect } from "react"

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }

  return (<Outlet/>)
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        index: "",
        Component: MainLayout,
        children: [
          {
            index: true,
            Component: HomePage,
            loader: async () => {
              const response = await fetch("/api/todos", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              if (!response.ok) {
                throw new Error("Failed to fetch todos")
              }
              const data = await response.json()
              return data
            },
            action: async ({ request }) => {
              const formData = await request.formData()
              const intent = formData.get("intent")

              if (intent == "create") {
                const title = formData.get("title")
                const description = formData.get("description")
                const response = await fetch("/api/todos", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  },
                  body: JSON.stringify({title,description})
                })
                return response
              }
              if (intent == "update") {
                const title = formData.get("title")
                const description = formData.get("description")
                const isComplete = formData.get("isComplete")
                const todoId = formData.get("todoId")
                console.log(title)
                const updateData = {}
                if (title !== null) updateData.title = title
                if (description !== null) updateData.description = description
                if (isComplete !== null) updateData.isComplete = isComplete == "true"
                const response = await fetch(`/api/todos/${todoId}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  },
                  body: JSON.stringify(updateData)
                })
                return response 
              }
              if (intent== "delete") {
                const todoId = formData.get("todoId")
                const response = await fetch(`/api/todos/${todoId}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
                })
                return response
              }
            }
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    Component: LoginPage
  }
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
