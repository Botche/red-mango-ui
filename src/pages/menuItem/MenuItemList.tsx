import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../../storage/redux/store";
import { MenuItemModel } from "../../types";
import { useDeleteMenuItemMutation } from "../../apis/menuItemApi";
import { ROUTES } from "../../utility/constants";

function MenuItemList() {
  const navigate = useNavigate();
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const menuItems = useSelector(
    (state: RootState) => state.menuItemStore.menuItem
  );

  const handleMenuItemDelete = async (id: string) => {
    toast.promise(
      deleteMenuItem(id),
      {
        pending: "Processing your request...",
        success: "Menu Item Deleted Successfully",
        error: "Error encountered",
      },
      {
        theme: "dark",
      }
    );
  };

  return (
    <div className="table p-5">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="text-success">Menu Items List</h1>
        <button
          className="btn btn-success"
          onClick={() => navigate(ROUTES.createMenuItem)}
        >
          Add New Menu Item
        </button>
      </div>
      <div className="p-2">
        <div className="row border">
          <div className="col-1">Image</div>
          <div className="col-1">ID</div>
          <div className="col-2">Name</div>
          <div className="col-2">Category</div>
          <div className="col-1">Price</div>
          <div className="col-2">Special Tag</div>
          <div className="col-1">Action</div>
        </div>
        {menuItems.map((menuItem: MenuItemModel) => (
          <div className="row border" key={menuItem.id}>
            <div className="col-1">
              <img
                src={menuItem.imageUrl}
                alt={menuItem.name}
                style={{ width: "100%", maxWidth: "120px" }}
              />
            </div>
            <div className="col-1">{menuItem.itemNumber}</div>
            <div className="col-2">{menuItem.name}</div>
            <div className="col-2">{menuItem.category}</div>
            <div className="col-1">${menuItem.price}</div>
            <div className="col-2">{menuItem.specialTag}</div>
            <div className="col-1">
              <button className="btn btn-success">
                <i
                  className="bi bi-pencil-fill"
                  onClick={() =>
                    navigate(ROUTES.updateMenuItem.replace(":id", menuItem.id))
                  }
                ></i>
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={() => handleMenuItemDelete(menuItem.id)}
              >
                <i className="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuItemList;
