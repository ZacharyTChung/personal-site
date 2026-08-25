import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    // The 3D scene scatters trees, fireflies, and leaves with Math.random()
    // inside useMemo on purpose: each visit gets a slightly different clearing.
    files: ["components/scene/clearing-3d.tsx"],
    rules: {
      "react-hooks/purity": "off",
    },
  },
];

export default config;
