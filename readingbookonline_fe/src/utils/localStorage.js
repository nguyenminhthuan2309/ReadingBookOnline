export const getItem = (item) => {
  try {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(item);
      if(!value) return;
      return JSON.parse(value);
    }
  } catch (err) {
    console.log(err);
  }
};

export const setItem = (item, value) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(item, value);
    }
  } catch (err) {
    console.log(err);
  }
};

export const clearAllItem = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  } catch (err) {
    console.log(err);
  }
};
