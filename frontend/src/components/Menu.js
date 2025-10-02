import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMenus } from '../actions/menuAction';
import { getRestaurants } from '../actions/restaurantAction';
import Fooditem from '../components/Fooditem';
import { setRestaurantId } from '../actions/cartActions';

const Menu = () => {
  const { id } = useParams();                   // id nhà hàng
  const dispatch = useDispatch();

  const { menus, loading, error } = useSelector((state) => state.menus);

  useEffect(() => {
    // set id nhà hàng cho giỏ hàng (chỉ 1 lần khi id đổi)
    dispatch(setRestaurantId(id));
    // gọi API
    dispatch(getMenus(id));
    dispatch(getRestaurants());
  }, [dispatch, id]);                            // ❗️đừng để dispatch ngoài useEffect / đừng thêm storeId

  if (loading) return <p>Loading menus...</p>;
  if (error)   return <p>Error: {String(error)}</p>;

  // luôn xử lý rỗng an toàn
  if (!menus || !Array.isArray(menus) || menus.length === 0) {
    return <p>No menus Available</p>;
  }

  return (
    <div>
      {menus.map((menuGroup) => (
        <div key={menuGroup.category || menuGroup._id}>
          <h2>{menuGroup.category}</h2>
          <hr />
          {Array.isArray(menuGroup.items) && menuGroup.items.length > 0 ? (
            <div className="row">
              {menuGroup.items.map((fooditem) => (
                <Fooditem key={fooditem._id} fooditem={fooditem} />
              ))}
            </div>
          ) : (
            <p>No fooditems available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;
