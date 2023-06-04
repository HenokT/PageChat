import postcssNesting from "postcss-nesting";

export default (ctx) => {
  return {
    plugins: [postcssNesting],
  };
};
