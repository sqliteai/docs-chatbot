import postcssImport from "postcss-import";
import tailwindcssPostcss from "@tailwindcss/postcss";
import postcssNested from "postcss-nested";
import postcssDiscardComments from "postcss-discard-comments";
import cssnano from "cssnano";

const removeLayersPlugin = () => {
  return {
    postcssPlugin: "remove-layers",
    Once(root) {
      const collectedRules = [];

      root.walkAtRules("layer", (rule) => {
        if (rule.nodes && rule.nodes.length > 0) {
          rule.nodes.forEach((node) => {
            collectedRules.push(node.clone());
          });
        }
        rule.remove();
      });

      collectedRules.forEach((rule) => {
        root.append(rule);
      });
    },
  };
};
removeLayersPlugin.postcss = true;

export default {
  plugins: [
    postcssImport(),
    tailwindcssPostcss(),
    postcssNested(),
    removeLayersPlugin(),
    postcssDiscardComments({
      removeAll: true,
    }),
    cssnano({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
          reduceIdents: false,
          zindex: false,
          discardUnused: false,
        },
      ],
    }),
  ],
};
