const NoticesSidebar = () => {
  return (
    <aside className="w-[24%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow px-5 pt-11 pb-6 w-full h-[65vh] text-black bg-orange-100 rounded-xl border-4 border-amber-600 border-solid max-md:mt-8">
        <h2 className="self-center text-2xl text-center">NOTICES</h2>
        <hr className="shrink-0 mt-5 mr-3 ml-3.5 max-w-full h-px border border-black border-solid w-[296px] max-md:mx-2.5" />
        <p className="px-3.5 pt-8 mt-10 text-lg bg-white rounded-xl min-h-[430px] max-md:pr-5 max-md:pb-28 max-md:mt-10">
          This is some notice from admin or any other user if they ping this
          user
        </p>
      </div>
    </aside>
  );
};

export default NoticesSidebar;
