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
        Our mission is to provide a seamless and innovative dining experience that redefines convenience and quality. We aim to deliver exceptional food inspired by global flavors right to your doorstep, faster and fresher than ever before.
.
        </p>
      </div>
    </div>
  );
}

export default BlogItem;
