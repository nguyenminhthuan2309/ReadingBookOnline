const TemporaryPasswordSection = () => {
  return (
    <section className="flex flex-col items-center self-center px-5 py-2.5 mt-7 max-w-full rounded-xl bg-zinc-300 w-[730px] max-md:pl-5">
      <div className="flex flex-wrap gap-5 justify-between self-stretch max-md:max-w-full">
        <p>Send me a temporary password</p>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/63951a924dc793b8d032966f3861fb16335c46a36f49736237f62780d544edcd?placeholderIfAbsent=true"
          alt="Send temporary password icon"
          className="object-contain shrink-0 self-start aspect-[1.19] w-[19px]"
        />
      </div>
      <div
        className="flex flex-wrap gap-4 max-w-full"
        style={{ width: "625px", marginTop: "1.25rem" }}
      >
        <label className="grow my-auto">Mail Sender:</label>
        <input
          className="flex shrink-0 max-w-full bg-white rounded-xl border border-black border-solid"
          style={{ width: "517px", height: "31px" }}
        />
      </div>
      <div
        className="flex flex-wrap gap-1 max-w-full"
        style={{ width: "625px", marginTop: "1.25rem" }}
      >
        <label className="grow my-auto">Mail Reciever:</label>
        <input
          className="flex shrink-0 max-w-full h-8 bg-white rounded-xl border border-black border-solid"
          style={{ width: "517px", height: "31px" }}
        />
      </div>
      <div
        className="px-16 pt-1.5 pb-4 mt-3.5 ml-3.5"
        style={{ width: "231px" }}
      >
        <button
          className=" text-xl text-white rounded-xl w-full"
          style={{ backgroundColor: "#3F3D6E" }}
        >
          Send
        </button>
      </div>
    </section>
  );
};

export default TemporaryPasswordSection;
