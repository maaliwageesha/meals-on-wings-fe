import { Link } from "react-router-dom";
import Button from "../Button";
import photo1 from "../../assets/about1.jpg";
import photo2 from "../../assets/about2.jpg";
import photo3 from "../../assets/about3.jpg";

function HeroSection() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="flex flex-col items-center justify-between gap-[20px] md:flex-row">
        <div className="w-full text-center  text-lg font-bold md:w-[50%] md:text-left">
          <p className="text-yellow">Welcome!</p>
          <h1 className="text-4xl">
            Best burger ideas & traditions from the whole world
          </h1>
          <p className="my-[10px] text-lightGray">
          Our journey began with a simple idea: to bring the world’s best foods to your doorstep using the latest in drone technology. Inspired by global flavors and driven by a love for culinary innovation, we created meals on wings to offer a unique dining experience that combines delicious food with unparalleled convenience
          </p>
          <p className="my-[30px] text-lightGray">
          We provide a behind-the-scenes look at how your drone delivery system works. Include details on the technology, logistics, and the journey from kitchen to doorstep.

          </p>
          <Link to={"/menu"}>
            <Button>Order Now</Button>
          </Link>
        </div>
        <div className="flex  w-full items-start gap-[10px] text-lg font-bold md:w-[50%] ">
          <img src={photo1} alt="about us" className="w-[50%] rounded-xl" />
          <div className="flex w-[50%] flex-col gap-[10px]">
            <img src={photo2} alt="about us" className="rounded-xl" />
            <img src={photo3} alt="about us" className="rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
