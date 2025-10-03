import postcssImport from "postcss-import";
import tailwindcssPostcss from "@tailwindcss/postcss";
import postcssNested from "postcss-nested";

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
  plugins: [tailwindcssPostcss(), removeLayersPlugin()],
};
