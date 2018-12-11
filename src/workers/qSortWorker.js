export default () => {
  onmessage = e => {
    if (!e) return;

    const { categories, wordsNumber, text } = e.data;

    if (!categories || !categories.length) {
      postMessage(categories);
      return;
    }

    categories.forEach(category => {
      if (!category.params || !category.params.length) {
        postMessage(categories);
        return;
      }

      category.params.forEach(param => {
        const regexp = new RegExp(`\\b(${param.name})\\b`, 'g');

        const count = (text.match(regexp) || []).length;

        const percent = count
          ? Math.round((count / wordsNumber) * 10000) / 100
          : 0;

        param.count = count;
        param.percent = percent;
      });

      const paramsCountSum = category.params.reduce(((result, item) => result + item.count), 0);

      category.average = (paramsCountSum && category.params.length)
        ? Math.round((paramsCountSum / category.params.length) * 100) / 100
        : 0;
    });

    postMessage(categories);
  };
};
