import { formatCurrency } from "../../utils/helpers";
import UpdateItemQuantity from "./UpdateItemQuantity";

function CartItem({ item }) {
  const { item_image, item_name, item_quantity, id, item_price } = item;

  return (
    <div
      className="flex items-center justify-between gap-[10px] border-b border-gray 
    px-[10px] py-[5px]"
    >
      <img src={item_image} alt="" className="w-[50px]" />
      <div className="mr-auto font-bold">
        <h5 className="text-sm">{item_name}</h5>
        <span className="text-xs">
          {formatCurrency(item_price)} {item_quantity > 1 && `x ${item_quantity}`}
        </span>
      </div>

      <UpdateItemQuantity id={id} currentQuantity={item_quantity} />
    </div>
  );
}

export default CartItem;
