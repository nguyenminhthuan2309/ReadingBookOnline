const ForumDiscussion = () => {
  return (
    <section className="flex flex-col pt-3.5 mx-auto w-full bg-orange-100 rounded-xl border border-black border-solid max-md:mt-10 max-md:max-w-full">
      <div className="flex z-10 flex-wrap gap-5 justify-between mr-6 ml-8 max-md:mr-2.5 max-md:max-w-full">
        <div className="flex gap-4">
          <div className="flex flex-col justify-center px-1 py-1.5 bg-amber-600">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h2 className="self-start text-3xl leading-loose text-black basis-auto">
            Forum discussion
          </h2>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/1dea6901624bde18b1e47ba60141fc631cdbb689d3582a9d80ee16e6cd87f3a9?placeholderIfAbsent=true"
          className="object-contain shrink-0 self-start w-6 aspect-square"
          alt="Forum icon"
        />
      </div>
      <hr className="flex shrink-0 mr-8 ml-6 max-w-full h-px border-b border-black bg-zinc-300 bg-opacity-0 w-[942px] max-md:mr-2.5" />

      {/* Forum Messages */}
      <div className="flex flex-col gap-5 mt-10 mr-7 ml-6">
        <article className="flex flex-wrap gap-5 justify-between">
          <div className="flex flex-wrap gap-2.5 text-base text-black">
            <div className="flex shrink-0 h-10 bg-red-500 rounded-full w-[33px]" />
            <p className="flex-auto max-md:max-w-full">
              <span className="text-red-500">Sample User A:</span> Lorem ipsum
              dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit
              integer. Nisl mattis adipiscing amet eget phasellus
            </p>
          </div>
          <time className="my-auto text-sm text-slate-800">
            Sample minutes ago
          </time>
        </article>

        <article className="flex flex-wrap gap-5 justify-between">
          <div className="flex flex-wrap gap-2.5 text-base text-black">
            <div className="flex shrink-0 h-10 bg-green-500 rounded-full w-[33px]" />
            <p className="flex-auto max-md:max-w-full">
              <span className="text-[#51AC61]">Sample User A:</span> Lorem ipsum
              dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit
              integer. Nisl mattis adipiscing amet eget phasellus
            </p>
          </div>
          <time className="my-auto text-sm text-slate-800">
            Sample minutes ago
          </time>
        </article>

        <article className="flex flex-wrap gap-5 justify-between">
          <div className="flex flex-wrap gap-2.5 text-base text-black">
            <div className="flex shrink-0 h-10 bg-indigo-700 rounded-full w-[33px]" />
            <p className="flex-auto max-md:max-w-full">
              <span className="text-[#2828E0]">Sample User A:</span> Lorem ipsum
              dolor sit amet consectetur. Mauris urna volutpat quis tempus a sit
              integer. Nisl mattis adipiscing amet eget phasellus
            </p>
          </div>
          <time className="my-auto text-sm text-slate-800">
            Sample minutes ago
          </time>
        </article>
      </div>

      <input
        type="text"
        placeholder="What would you like to discuss? . . ."
        className="px-6 py-4 mt-7 text-lg text-black bg-white rounded-none border-r border-b border-l border-black max-md:px-5 max-md:max-w-full"
      />
    </section>
  );
};

export default ForumDiscussion;
