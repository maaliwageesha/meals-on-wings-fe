function BlogItem({ blog }) {
  const { title, image } = blog;
  return (
    <div className="rounded-xl  border border-lightGray">
      <img
        src={image}
        alt={title}
        className="w-full rounded-t-xl object-cover"
      />
      <div className="p-[20px]">
        <h2 className="cursor-pointer text-2xl font-bold hover:text-darkYellow sm:text-4xl">
          {title}
        </h2>
        <p className="my-[10px] text-lightGray">
        Explore the evolution of food delivery and how drone technology is revolutionizing the industry. Discuss the benefits, challenges, and future prospects of drone deliveries.
        </p>
      </div>
    </div>
  );
}

export default BlogItem;
