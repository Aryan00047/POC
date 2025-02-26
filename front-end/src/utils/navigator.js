let navigateFunction = null;

export const setNavigator = (navFunction) => {
  navigateFunction = navFunction;
};

export const navigate = (path) => {
  if (navigateFunction) {
    navigateFunction(path); // Perform navigation
  } else {
    console.error("Navigation function is not set");
  }
};