import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { Header, Footer } from "../components/layout";
import {
  AccessDenied,
  AllOrders,
  Home,
  Login,
  MenuItemDetails,
  MenuItemList,
  MenuItemUpsert,
  MyOrders,
  NotFound,
  OrderConfirmed,
  OrderDetails,
  Payment,
  Register,
  ShoppingCart,
} from "../pages";
import { useLazyGetShoppingCartQuery } from "../apis/shoppingCartApi";
import { setShoppingCart } from "../storage/redux/shoppingCartSlice";
import { UserModel } from "../interfaces";
import { setLoggedInUser } from "../storage/redux/userAuthSlice";
import { RootState } from "../storage/redux/store";
import { useGetMenuItemsQuery } from "../apis/menuItemApi";
import { setMenuItem } from "../storage/redux/menuItemSlice";
import { MainLoader } from "../components/page/common";

function App() {
  const dispatch = useDispatch();
  const userData: UserModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const [
    getShoppingCart,
    { isLoading: isGetShoppingCartLoading, isSuccess, currentData },
  ] = useLazyGetShoppingCartQuery();
  const { data, isLoading: isGetMenuItemsLoading } = useGetMenuItemsQuery(null);

  useEffect(() => {
    const token = localStorage.getItem("token")!;
    if (token) {
      const { fullName, email, id, role }: UserModel = jwtDecode(token);
      dispatch(setLoggedInUser({ fullName, email, id, role }));
      getShoppingCart(id);
    }
  }, [dispatch, getShoppingCart, userData]);

  useEffect(() => {
    if (isSuccess && !isGetShoppingCartLoading) {
      dispatch(setShoppingCart(currentData?.result.cartItems));
    }
  }, [isGetShoppingCartLoading, isSuccess, currentData, dispatch]);

  useEffect(() => {
    if (!isGetMenuItemsLoading) {
      dispatch(setMenuItem(data.result));
    }
  }, [isGetMenuItemsLoading, data, dispatch]);

  if (isGetMenuItemsLoading) {
    return <MainLoader />;
  }

  return (
    <div className="">
      <Header />
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/menuItemDetails/:menuItemId"
            element={<MenuItemDetails />}
          />
          <Route path="/shoppingCart" element={<ShoppingCart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/order/orderConfirmed/:id"
            element={<OrderConfirmed />}
          />
          <Route path="/order/myOrders" element={<MyOrders />} />
          <Route path="/order/orderDetails/:id" element={<OrderDetails />} />
          <Route path="/order/allOrders" element={<AllOrders />} />
          <Route path="/menuItem/menuItemList" element={<MenuItemList />} />
          <Route
            path="/menuItem/menuItemUpsert/:id?"
            element={<MenuItemUpsert />}
          />

          <Route path="/accessDenied" element={<AccessDenied />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
