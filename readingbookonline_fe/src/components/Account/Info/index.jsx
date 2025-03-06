

import NoticesSidebar from "./NoticesSidebar";
import UserProfile from "./UserProfile";
import ContentSection from "./ContentSection";
import BookTile from "./BookTile";

const AccountPage = () => {
  const mangaData = [
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/e92894589b336ed4046530e3909cb81ee42051da248306fb602a9a704185e1d6?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      rating:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/482ed7c3aa50d5575d3c1424c8b47c8542456220bf09f3b7ab3e11d18546f0ef?placeholderIfAbsent=true",
      chapters: [
        { title: "Chapter Sample", date: "Sample Date Month, Year" },
        { title: "Chapter Sample", date: "Sample Date Month, Year" },
      ],
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/e9e63c9f3460680bd02893bc2d967952b726690faffae2c4632b9923f5772ebf?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      rating:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/2043b3f4dedfe1a1b3c0124989de2a753eb7715d3ad1b1f502d5369c6ec5517d?placeholderIfAbsent=true",
      chapters: [
        { title: "Chapter Sample", date: "Sample Date Month, Year" },
        { title: "Chapter Sample", date: "Sample Date Month, Year" },
      ],
    },
    {
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/e92894589b336ed4046530e3909cb81ee42051da248306fb602a9a704185e1d6?placeholderIfAbsent=true",
      title: "Sample Manga",
      author: "Sample Author",
      rating:
        "https://cdn.builder.io/api/v1/image/assets/a1c204e693f745d49e0ba1d47d0b3d23/482ed7c3aa50d5575d3c1424c8b47c8542456220bf09f3b7ab3e11d18546f0ef?placeholderIfAbsent=true",
      chapters: [
        { title: "Chapter Sample", date: "Sample Date Month, Year" },
        { title: "Chapter Sample", date: "Sample Date Month, Year" },
      ],
    },
  ];

  return (
    <div className="rounded-none">
      <div className="flex flex-col w-full bg-red-100 max-md:max-w-full">
        <main className="flex flex-col self-center mt-10 w-full max-w-[1521px] max-md:mt-10 max-md:max-w-full">
          <nav className="self-start text-3xl text-black">
            <a href="/">Home</a>/<a href="/account">Account</a>
          </nav>

          <div className="mt-7 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <NoticesSidebar />
              <div className="ml-5 w-[76%] max-md:ml-0 max-md:w-full">
                <div className="w-full max-md:mt-8 max-md:max-w-full">
                  <UserProfile />

                  <ContentSection title="Gallery">
                    {mangaData.map((manga, index) => (
                      <BookTile key={index} {...manga} />
                    ))}
                  </ContentSection>

                  <ContentSection title="Favorites">
                    {mangaData.map((manga, index) => (
                      <BookTile key={index} {...manga} />
                    ))}
                  </ContentSection>

                  <ContentSection title="Recently">
                    {mangaData.map((manga, index) => (
                      <BookTile key={index} {...manga} />
                    ))}
                  </ContentSection>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
