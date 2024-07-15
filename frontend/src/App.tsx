import {Todo} from "./Todo.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import TodoColumn from "./TodoColumn.tsx";
import {allPossibleTodos} from "./TodoStatus.ts";
import {Route, Routes} from "react-router";
import {Link} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.tsx";

function App() {

    const [todos, setTodos] = useState<Todo[]>()
    const [user, setUser] = useState<{username: string} | undefined | null>(undefined)

    function fetchTodos() {
        axios.get("/api/todo")
            .then(response => {
                setTodos(response.data)
            })
    }

    const login = () => {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080' : window.location.origin

        window.open(host + '/oauth2/authorization/github', '_self')
    }

    const logout = () => {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080' : window.location.origin

        window.open(host + '/logout', '_self')
    }

    const me = () => {
        axios.get("/api/auth/me")
            .then(response => {
                setUser(response.data)
            })
            .catch(() => {
                setUser(null)
            })
    }

    useEffect(fetchTodos, [])

    useEffect(() => {
        me()
    }, []);

    if (!todos) {
        return "Lade..."
    }

    return (
        <>
            <button onClick={login}>Login</button>
            <button onClick={logout}>Logout</button>
            <p>User: {user?.username}</p>
            <Link to={"/"}>Home</Link>
            <Link to={"/todos"}>Todos</Link>
            <Routes>
                <Route path="/" element={<p>Home</p>}/>

                <Route element={<ProtectedRoute user={user?.username}/>}>

                    <Route path="/todos"  element={<div className="page">
                        <h1>TODOs</h1>
                        {
                            allPossibleTodos.map(status => {
                                const filteredTodos = todos.filter(todo => todo.status === status)
                                return <TodoColumn
                                    status={status}
                                    todos={filteredTodos}
                                    onTodoItemChange={fetchTodos}
                                    key={status}
                                />
                            })
                        }
                    </div>}/>

                    <Route path="/profile" element={<p>{user?.username}</p>}/>

                </Route>

            </Routes>
        </>
    )
}

export default App
