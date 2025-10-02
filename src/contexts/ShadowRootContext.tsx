import { createContext } from "react";

type ShadowRootContextType = HTMLElement | undefined;

export const ShadowRootContext =
  createContext<ShadowRootContextType>(undefined);
