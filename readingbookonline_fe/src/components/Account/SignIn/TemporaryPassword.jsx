
import { useState } from "react";

const TemporaryPasswordSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="flex flex-col items-center self-center px-5 py-2.5 mt-6 max-w-full rounded-xl bg-zinc-300 w-[730px] max-md:pl-5">
      <div className="flex flex-wrap gap-5 justify-between self-stretch max-md:max-w-full">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <span>Send me a temporary password</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/63951a924dc793b8d032966f3861fb16335c46a36f49736237f62780d544edcd?placeholderIfAbsent=true"
            alt="Toggle temporary password"
            className="object-contain shrink-0 self-start aspect-[1.19] w-[19px]"
          />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mt-5 max-w-full w-[628px]">
        <label className="grow my-auto">Mail Sender:</label>
        <input className="flex shrink-0 max-w-full bg-white rounded-xl border border-black border-solid h-[31px] w-[517px]" />
      </div>

      <div className="flex flex-wrap gap-1 mt-3.5 max-w-full w-[625px]">
        <label className="grow my-auto">Mail Receiver:</label>
        <input className="flex shrink-0 max-w-full h-8 bg-white rounded-xl border border-black border-solid w-[517px]" />
      </div>

      <button className="px-16 pt-1.5 pb-4 mt-3.5 ml-3.5 max-w-full text-xl text-white whitespace-nowrap rounded-xl bg-slate-600 w-[231px] max-md:px-5">
        Send
      </button>
    </section>
  );
};

export default TemporaryPasswordSection;
