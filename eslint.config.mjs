import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
  {
    rules: {
      // Reglas nuevas de React Compiler en eslint-config-next@16 que marcan como
      // error patrones preexistentes en todo el código (data-fetching en useEffect
      // y mutaciones optimistas de estado). Corregirlas es un refactor aparte,
      // fuera del alcance de la Etapa 2 (seguridad); se desactivan con este
      // justificativo y el resto de reglas sigue activo.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
