const NoticesCard = () => {
  return (
    <article className="p-5 bg-orange-100 rounded-lg border-4 border-amber-600 border-solid w-[462px] max-sm:w-full">
      <header className="mb-5 text-2xl text-center">
        <h2>NOTICES</h2>
        <div className="mx-0 my-2.5 h-px bg-black" />
      </header>
      <div className="p-4 bg-white rounded-xl">
        <p>This is some notice from admin</p>
        <p>This is also a notice from admin</p>
        <p>This is also also notice from admin</p>
      </div>
    </article>
  );
};

export default NoticesCard;
