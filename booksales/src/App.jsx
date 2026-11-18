import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from './Context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './Pages/Home';
import About from './Pages/About';
import Team from './Pages/Team';
import Contact from './Pages/Contact';
import Books from './Pages/Books';
import ShowBook from './Pages/Books/Show';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';
import Login from './Pages/Out/Login';
import Register from './Pages/Out/Register';

import AdminLayout from './Pages/Admin/Layout';

import Genres from './Pages/Admin/Genres';
import CreateGenre from './Pages/Admin/Genres/Create';
import EditGenre from './Pages/Admin/Genres/Edit';

import Authors from './Pages/Admin/Authors';
import CreateAuthor from './Pages/Admin/Authors/Create';
import EditAuthor from './Pages/Admin/Authors/Edit';

import AdminBooks from './Pages/Admin/Books';
import CreateBook from './Pages/Admin/Books/Create';
import EditBook from './Pages/Admin/Books/Edit';

import Orders from './Pages/Admin/Orders';
import Users from './Pages/Admin/Users';
import AdminMessages from './Pages/Admin/Messages';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Halaman Publik */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/books" element={<Books />} />
                        <Route path="/books/:id" element={<ShowBook />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route
                            path="/payment/:orderNumber"
                            element={
                                <ProtectedRoute customerOnly>
                                    <Payment />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/team" element={<Team />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Halaman Admin - Khusus Admin */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                index
                                element={<Navigate to="books" replace />}
                            />

                            {/* Book */}
                            <Route path="books" element={<AdminBooks />} />
                            <Route path="books/create" element={<CreateBook />} />
                            <Route path="books/edit/:id" element={<EditBook />} />

                            {/* Genre */}
                            <Route path="genres" element={<Genres />} />
                            <Route path="genres/create" element={<CreateGenre />} />
                            <Route path="genres/edit/:id" element={<EditGenre />} />

                            {/* Author */}
                            <Route path="authors" element={<Authors />} />
                            <Route path="authors/create" element={<CreateAuthor />} />
                            <Route path="authors/edit/:id" element={<EditAuthor />} />

                            {/* Orders, Users & Messages */}
                            <Route path="orders" element={<Orders />} />
                            <Route path="users" element={<Users />} />
                            <Route path="messages" element={<AdminMessages />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
