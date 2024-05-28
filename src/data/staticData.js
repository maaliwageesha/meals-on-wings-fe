import { CiCoffeeCup, CiIceCream, CiPizza, CiGrid41 } from "react-icons/ci";
import { FaFish, FaHamburger } from "react-icons/fa";

import imageSlider1 from "../assets/slider1.jpg";
import imageSlider2 from "../assets/slider2.jpg";
import imageSlider3 from "../assets/slider3.jpg";
import imageSlider4 from "../assets/slider4.jpg";

import categoryImage1 from "../assets/Baked.png";
import categoryImage2 from "../assets/Burger.png";
import categoryImage3 from "../assets/Chicken.png";
import categoryImage4 from "../assets/Coffee.png";
import categoryImage5 from "../assets/Fast.png";
import categoryImage6 from "../assets/Fish.png";

import teamImage1 from "../assets/manager.jpg";
import teamImage2 from "../assets/chef-1.jpg";
import teamImage3 from "../assets/chef2.jpg";

import blogImage1 from "../assets/blog1.jpg";
import blogImage2 from "../assets/blog2.jpg";
import blogImage3 from "../assets/blog3.jpg";
import blogImage4 from "../assets/blog-4.jpg";
import blogImage5 from "../assets/blog5.jpg";
import blogImage6 from "../assets/blog6.jpg";
import blogImage7 from "../assets/blog7.jpg";
import blogImage8 from "../assets/blog8.jpg";
import blogImage9 from "../assets/blog9.jpg";
import blogImage10 from "../assets/blog10.jpg";

import clientImage1 from "../assets/person1.jpg";
import clientImage2 from "../assets/person2.jpg";
import clientImage3 from "../assets/person3.jpg";
import clientImage4 from "../assets/person4.jpg";

// import burger from "../assets/product/dish_06.png";
// import pizza from "../assets/product/our-story.png";
// import drink from "../assets/product/d1.png";
// import iceCream from "../assets/product/i1.png";
// import fish from "../assets/product/fi2.png";

export const headerLinks = [
  {
    id: 1,
    title: "Home",
    to: "/",
  },

  {
    id: 2,
    title: "Menu",
    to: "/menu",
  },

  {
    id: 3,
    title: "About US",
    to: "/about",
  },

  {
    id: 4,
    title: "Blog",
    to: "/blog",
  },

  {
    id: 5,
    title: 'Drone',
    to: "/drone",
  }
];



export const loginFormData = [
  {
    id: 1,
    title: "Email",
    name: "email",
    type: "text",
  },
  {
    id: 2,
    title: "Password",
    name: "password",
    type: "password",
  },
];

export const sliderImages = [
  imageSlider1,
  imageSlider2,
  imageSlider3,
  imageSlider4,
];

export const categoryDta = [
  {
    id: 1,
    img: categoryImage1,
  },

  {
    id: 2,
    img: categoryImage2,
  },

  {
    id: 3,
    img: categoryImage3,
  },

  {
    id: 4,
    img: categoryImage4,
  },

  {
    id: 5,
    img: categoryImage5,
  },

  {
    id: 6,
    img: categoryImage6,
  },
];

// export const productData = [
//   {
//     id: 1,
//     title: "This Is Title",
//     image: burger,
//     qty: 1,
//     category: "burger",
//   },
//   {
//     id: 2,
//     title: "This Is Title",
//     image: burger,
//     category: "burger",
//     qty: 1,
//   },

//   {
//     id: 3,
//     title: "This Is Title",
//     image: burger,
//     category: "burger",
//     qty: 1,
//   },

//   {
//     id: 4,
//     title: "This Is Title",
//     image: burger,
//     category: "burger",
//     qty: 1,
//   },

//   {
//     id: 5,
//     title: "This Is Title",
//     image: pizza,
//     category: "pizza",
//     qty: 1,
//   },

//   {
//     id: 6,
//     title: "This Is Title",
//     image: pizza,
//     category: "pizza",
//     qty: 1,
//   },

//   {
//     id: 7,
//     title: "This Is Title",
//     image: pizza,
//     category: "pizza",
//   },

//   {
//     id: 8,
//     title: "This Is Title",
//     image: pizza,
//     category: "pizza",
//   },

//   {
//     id: 9,
//     title: "This Is Title",
//     image: drink,
//     category: "drink",
//   },

//   {
//     id: 10,
//     title: "This Is Title",
//     image: drink,
//     category: "drink",
//   },

//   {
//     id: 11,
//     title: "This Is Title",
//     image: drink,
//     category: "drink",
//   },

//   {
//     id: 12,
//     title: "This Is Title",
//     image: drink,
//     category: "drink",
//   },

//   {
//     id: 13,
//     title: "This Is Title",
//     image: iceCream,
//     category: "iceCream",
//   },

//   {
//     id: 14,
//     title: "This Is Title",
//     image: iceCream,
//     category: "iceCream",
//   },

//   {
//     id: 15,
//     title: "This Is Title",
//     image: iceCream,
//     category: "iceCream",
//   },

//   {
//     id: 16,
//     title: "This Is Title",
//     image: iceCream,
//     category: "iceCream",
//   },

//   {
//     id: 17,
//     title: "This Is Title",
//     image: fish,
//     category: "fish",
//   },

//   {
//     id: 18,
//     title: "This Is Title",
//     image: fish,
//     category: "fish",
//   },

//   {
//     id: 19,
//     title: "This Is Title",
//     image: fish,
//     category: "fish",
//   },

//   {
//     id: 20,
//     title: "This Is Title",
//     image: fish,
//     category: "fish",
//   },
// ];

export const categoryData = [
  {
    id: 1,
    title: "All",
    category: "all",
    qty: 1,
    icon: CiGrid41,
  },

  {
    id: 2,
    title: "Burger",
    category: "burger",
    qty: 1,
    icon: FaHamburger,
  },

  {
    id: 3,
    title: "Pizza",
    category: "pizza",
    qty: 1,
    icon: CiPizza,
  },

  {
    id: 4,
    title: "Fish",
    category: "fish",
    qty: 1,
    icon: FaFish,
  },

  {
    id: 5,
    title: "Ice Cream",
    category: "iceCream",
    qty: 1,
    icon: CiIceCream,
  },

  {
    id: 6,
    title: "Drinks",
    category: "drink",
    qty: 1,
    icon: CiCoffeeCup,
  },
];

export const ourTeamData = [
  { id: 1, image: teamImage1, name: "Malidi Jinadasa", title: "Manager" },
  { id: 2, image: teamImage2, name: "Shenuki Perera", title: "Chef" },
  { id: 3, image: teamImage3, name: "Athul", title: "Chef" },
];

export const blogData = [
  {
    id: 1,
    title: "The Future of Food Delivery: How Drone Technology is Changing the Game",
    image: blogImage1,
  },
  {
    id: 2,
    title: "Global Flavors Delivered to Your Doorstep: Exploring Our Diverse Menu",
    image: blogImage2,
  },

  {
    id: 3,
    title: "Behind the Scenes: A Day in the Life of a Drone",
    image: blogImage3,
  },

  {
    id: 4,
    title: "Sustainability in Food Delivery: How Drones Reduce Our Carbon Footprint",
    image: blogImage4,
  },

  {
    id: 5,
    title: "Customer Stories: How Our App Makes Life Easier",
    image: blogImage5,
  },

  {
    id: 6,
    title: "Meet the Chefs: The Culinary Experts Behind Our Delicious Dishes",
    image: blogImage6,
  },

  {
    id: 7,
    title: "Safety First: Ensuring Safe and Reliable Drone Deliveries",
    image: blogImage7,
  },

  {
    id: 8,
    title: "Cooking Tips and Recipes from Our Kitchen to Yours",
    image: blogImage8,
  },

  {
    id: 9,
    title: "Tech Talk: Innovations in Drone Delivery Technology",
    image: blogImage9,
  },

  {
    id: 10,
    title: "The Impact of COVID-19 on Food Delivery Trends",
    image: blogImage10,
  },
];

export const ClientsData = [
  {
    id: 1,
    description:
      "“Forget the trendy pizza shops, This hidden spot makes the best New York-style pizza slice in naples”",
    name: "Stephen Tindle",
    image: clientImage1,
  },

  {
    id: 2,
    description:
      "“I would be lost without restaurant. I would like to personally thank you for your outstanding product.”",
    name: "John Doe",
    image: clientImage2,
  },

  {
    id: 3,
    description:
      "“I am completely blown away. I would also like to say thank you to all your staff. It's really wonderful.”",
    name: "Clara",
    image: clientImage3,
  },

  {
    id: 4,
    description:
      "“Forget the trendy pizza shops, This hidden spot makes the best New York-style pizza slice in naples”",
    name: "Nina Margaret",
    image: clientImage4,
  },
];
