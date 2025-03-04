import React from "react";

function BookDetails() {
  return (
    <section className="flex gap-5 max-md:flex-col">
      <aside className="w-1/5 max-md:ml-0 max-md:w-full">
        <div className="flex flex-col w-full max-md:mt-10">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/0e34b6fc38407311392dfbb885815cfd682a3fa578f31e5b43e027c9f26d8ba9?placeholderIfAbsent=true"
            alt="Manga cover"
            className="object-contain mt-9 w-full aspect-[0.74]"
          />
          <div className="flex">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/b6ceeda3329582929adc7b8fc395eb34bc1b3ecba47f6293a435cfd2529dd947?placeholderIfAbsent=true"
              alt="Rating star"
              className="object-contain shrink-0 aspect-[0.85] w-[55px]"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/f9a1d2b64d29afa1a48dd87a224c8bc0911dc3d0dd414bb1450ae185b8730663?placeholderIfAbsent=true"
              alt="Rating star"
              className="object-contain shrink-0 aspect-[0.83] w-[54px]"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/7c1f447c9ccc73b05c28f81200fef1bc74aee0133956f4dfd3e955d522e7bf1b?placeholderIfAbsent=true"
              alt="Rating star"
              className="object-contain shrink-0 aspect-[0.85] w-[55px]"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/0b1031cfaa7350ac7ea1d6262cf076063525c28ff55a97013aa140bf473aaf80?placeholderIfAbsent=true"
              alt="Rating star"
              className="object-contain shrink-0 aspect-[0.83] w-[54px]"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/a479f5af5040b762ce51c4ecbc898cd196285c9eb3ee39c6e1c111f743b6e631?placeholderIfAbsent=true"
              alt="Rating star"
              className="object-contain shrink-0 aspect-[0.85] w-[55px]"
            />
          </div>
          <div className="flex gap-5 self-center mt-12 w-60 max-w-full max-md:mt-10">
            <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
              <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
            </div>
            <h2 className="grow shrink self-start text-3xl leading-loose text-black w-[163px]">
              Descriptions
            </h2>
          </div>
        </div>
      </aside>

      <article className="ml-5 w-4/5 max-md:ml-0 max-md:w-full">
        <div className="flex flex-col self-stretch my-auto w-full max-md:mt-10 max-md:max-w-full">
          <h1 className="self-start text-6xl font-semibold text-black max-md:text-4xl">
            Manga 1
          </h1>
          <div className="mt-7 w-full max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="w-[67%] max-md:ml-0 max-md:w-full">
                <div className="grow mt-2.5 max-md:mt-10 max-md:max-w-full">
                  <div className="flex gap-5 max-md:flex-col">
                    <div className="w-[36%] max-md:ml-0 max-md:w-full">
                      <div className="flex flex-col grow max-md:mt-3.5">
                        <dl className="text-2xl leading-10 text-black">
                          <dt>Alternative title(s):</dt>
                          <dt>Author(s):</dt>
                          <dt>Artist(s):</dt>
                          <dt>Genre(s):</dt>
                          <dt>Type:</dt>
                          <dt>Release:</dt>
                          <dt>Status:</dt>
                        </dl>
                        <button className="self-start px-6 py-1.5 mt-2.5 text-3xl text-white rounded-2xl bg-slate-600 max-md:px-5">
                          Read First
                        </button>
                      </div>
                    </div>
                    <div className="ml-5 w-[64%] max-md:ml-0 max-md:w-full">
                      <div className="flex flex-col grow max-md:mt-3.5">
                        <dl className="ml-6 text-2xl leading-10 text-stone-400 max-md:ml-2.5">
                          <dd>Sample title</dd>
                          <dd>Sample author</dd>
                          <dd>Ample artist</dd>
                          <dd>Genre 1, Genre 2, Genre 3</dd>
                          <dd>Novel/Manhua/Manga/Manhwa</dd>
                          <dd>Sample time MM, yyyy</dd>
                          <dd>On Going/Completed/Dropped</dd>
                        </dl>
                        <button className="self-start px-6 pt-1.5 pb-5 mt-2.5 text-3xl text-white rounded-2xl bg-slate-600 max-md:px-5">
                          Read Last
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                <div className="flex gap-10 text-3xl leading-10 text-center text-black max-md:mt-10">
                  <div className="flex flex-col">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/0aa0cc64a90b957cc6875d010518c312cc444301d4b6b199748772e615ccc724?placeholderIfAbsent=true"
                      alt="Views icon"
                      className="object-contain self-center aspect-[0.89] w-[65px]"
                    />
                    <p>0Views</p>
                  </div>
                  <div className="mt-20 max-md:mt-10">
                    0 <br />
                    Favorites
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default BookDetails;
