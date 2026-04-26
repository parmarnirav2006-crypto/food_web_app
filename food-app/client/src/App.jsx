import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar.jsx';
import Footer from './components/Layout/Footer.jsx';
import ProtectedRoute from './components/Layout/ProtectedRoute.jsx';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import VerifyOTP from './pages/Auth/VerifyOTP.jsx';
import RestaurantList from './pages/Restaurant/RestaurantList.jsx';
import RestaurantDetail from './pages/Restaurant/RestaurantDetail.jsx';
import Cart from './pages/Cart/Cart.jsx';
import Orders from './pages/Orders/Orders.jsx';
import OrderDetail from './pages/Orders/OrderDetail.jsx';
import Profile from './pages/Profile/Profile.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ManageRestaurants from './pages/Admin/ManageRestaurants.jsx';
import ManageOrders from './pages/Admin/ManageOrders.jsx';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:identifier" element={<RestaurantDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute roles={['admin']}>
                <ManageRestaurants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute roles={['admin']}>
                <ManageOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
