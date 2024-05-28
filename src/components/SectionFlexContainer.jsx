import { Link } from "react-router-dom";
import Button from "./Button";

function SectionFlexContainer({
  images,
  title,
  description,
  flex = "md:flex-row",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-between gap-[20px] ${flex}`}
    >
      <div className="w-full md:w-[50%]">
        <img src={images} alt={title} />
      </div>
      <div className="w-full text-center text-base font-bold md:w-[50%] md:text-left md:text-lg">
        <p className="text-yellow">{description}</p>
        <h1 className="text-4xl md:text-2xl">{title}</h1>
        <p className="my-[10px] text-lightGray">
        Our menu is a fusion of global inspirations and gourmet craftsmanship. Each dish is crafted with the finest ingredients, ensuring a burst of flavor in every bite. From juicy burgers to spicy Mexican dishes, savory Asian cuisine, and fresh Mediterranean delights, our diverse menu offers something for everyone, all delivered straight to you by our state-of-the-art drones
        </p>
        <Link to={"/menu"}>
          <Button>Order Now</Button>
        </Link>
      </div>
    </div>
  );
}

export default SectionFlexContainer;
