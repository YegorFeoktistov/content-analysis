export default () => {
  onmessage = e => {
    if (!e) return;

    const { files } = e.data;

    const reader = new FileReader();
    reader.onload = () => {
      const { result } = reader;
      const text = result ? result.replace(/\r?\n|\r/g, "") : result;

      postMessage({ text });
    };

    reader.readAsText(files[0]);
  };
};
