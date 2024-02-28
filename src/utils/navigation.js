export const startViewTransition = () => {
  if (!checkIsNavigationSupported) {
    window.navigation.addEventListener("navigate", (event) => {
      const toUrl = new URL(event.destination.url);

      if (location.origin !== toUrl.origin) return;

      event.intercept({
        async handler() {
          const data = await fetchPage(event.destination.url);

          document.startViewTransition(() => {
            document.documentElement.scrollTop = 0;
            document.body.innerHTML = data;
          });
        },
      });
    });
  }
};

const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition);
};

const fetchPage = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const data = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
  return data;
};
