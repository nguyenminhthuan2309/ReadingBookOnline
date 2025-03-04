const MostViewedSection = () => {
  return (
    <section className="p-5 bg-orange-100 rounded-xl">
      <h2 className="pb-2.5 mb-5 text-3xl border-b border-solid border-b-black">
        Most view book
      </h2>
      <div className="flex flex-col gap-5">
        <article className="flex gap-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4316844be07fd4e8642ffebeeb194858e67a183a"
            alt="Sample Manga"
            className="object-cover h-[150px] w-[113px]"
          />
          <div className="flex flex-col gap-1.5">
            <h3 className="mb-1.5 text-2xl">Sample Manga</h3>
            <p className="mb-2.5 text-base text-black">Sample Author</p>
            <div className="px-2.5 py-1.5 text-sm rounded-md bg-zinc-300">
              Chapter Sample
            </div>
            <p className="text-sm text-stone-600">Sample Date Month, Year</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default MostViewedSection;
