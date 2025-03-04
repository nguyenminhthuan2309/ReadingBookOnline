const NoticesSection = () => {
  return (
    <aside className="flex flex-col grow px-10 py-8 w-full text-black bg-orange-100 rounded-xl border-4 border-amber-600 border-solid max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <h2 className="self-center text-2xl text-center">NOTICES</h2>
      <hr className="shrink-0 mt-2 max-w-full h-px border border-black border-solid w-[382px]" />
      <section className="px-5 pt-2.5 pb-44 mt-2.5 text-lg bg-white rounded-xl max-md:pr-5 max-md:pb-28">
        <p>This is some notice from admin</p>
        <p>This is also a notice from admin</p>
        <p>This is also also notice from admin</p>
      </section>
    </aside>
  );
};

export default NoticesSection;
