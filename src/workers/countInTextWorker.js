export default () => {
  onmessage = e => {
    if (!e) return;

    const { text, regexp } = e.data;

    postMessage((text.match(regexp) || []).length);
  };
};
