import { ShadowRootContext } from "@/contexts/ShadowRootContext";
import { useContext } from "react";

export const useShadowRoot = () => useContext(ShadowRootContext);
