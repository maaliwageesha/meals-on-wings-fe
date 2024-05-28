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
          Our Story <br/>
          Discover how our innovative approach to food delivery was born. Combining a passion for great burgers with cutting-edge technology, we set out to revolutionize the dining experience by delivering gourmet burgers straight to your door using drones.
          <p className="my-[10px] text-lightGray">
          <br/>Our Mission <br/>
          Our mission is to provide a seamless and innovative dining experience that redefines convenience and quality. We aim to deliver exceptional burgers inspired by global flavors right to your doorstep, faster and fresher than ever before.
          </p>
          <p className="my-[10px] text-lightGray">
          <br/>Our Technology<br/>
          Explain the drone delivery system and how it enhances the customer experience by ensuring faster and fresher deliveries. Highlight the innovation and efficiency of this technology.
          </p>
          </p>
          <p className="my-[30px] text-lightGray">
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
