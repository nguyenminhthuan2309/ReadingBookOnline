
const UserProfile = () => {
  return (
    <section className="flex flex-wrap gap-10 items-start px-12 py-6 bg-orange-100 rounded-xl max-md:px-5">
      <div className="flex flex-col items-center max-w-full text-xl text-black whitespace-nowrap w-[132px]">
        <div className="flex shrink-0 self-stretch w-full rounded-full bg-zinc-300 h-[132px]" />
        <div className="flex z-10 shrink-0 -mt-3 w-6 h-6 bg-green-400 rounded-full" />
        <div className="flex gap-3 mt-4 w-[90px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/4ff2f2322708170e421493027c514a50c0af3fe64b931c89ca4737eb7bc6ea42?placeholderIfAbsent=true"
            alt="Rating icon"
            className="object-contain shrink-0 aspect-square w-[38px]"
          />
          <span className="my-auto">NaN</span>
        </div>
      </div>
      <div className="flex flex-col grow shrink-0 mt-2.5 text-black basis-0 w-fit max-md:max-w-full">
        <div className="flex gap-5 items-start text-xl text-white max-md:max-w-full">
          <h1 className="grow self-stretch text-4xl text-black">
            Sample Username
          </h1>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/8b4ccdb5cdc611f86a569fc32224b5e63189f9d905509f2a3792c9f7d6291564?placeholderIfAbsent=true"
            alt="Settings"
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
          <button className="px-4 py-1.5 mt-2.5 rounded-xl bg-slate-600">
            Reset Password
          </button>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/8d86f5ae0af72176dac1a4bec12fd28897771948d5a49485c91cf2af54152320?placeholderIfAbsent=true"
            alt="More options"
            className="object-contain shrink-0 mt-1.5 aspect-square w-[38px]"
          />
        </div>
        <p className="self-start mt-2 text-3xl">@UserAlias</p>
        <p className="px-5 pt-4 pb-20 mt-2 text-lg bg-white rounded-3xl max-md:mr-2.5 max-md:max-w-full">
          User's Bio . . .
        </p>
      </div>
    </section>
  );
};

export default UserProfile;
