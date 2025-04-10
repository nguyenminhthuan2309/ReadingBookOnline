export const isImageURLValid = async (imageURL) => {
  try {
    const res = await fetch(imageURL, { method: "HEAD" });
    return res.ok && res.headers.get("Content-Type")?.startsWith("image/");
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getImageURL = async (imageURL) => {
  if (!imageURL) {
    return "/images/noImage.png";
  }
  try {
    const isValid = await isImageURLValid(imageURL);
    return isValid ? imageURL : "/images/noImage.png";
  } catch (error) {
    console.log(error);
    return "/images/noImage.png";
  }
};
