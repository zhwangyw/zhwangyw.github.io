import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);
gsap.defaults({ ease: "power2.out", duration: 0.8 });

export { gsap, Draggable, InertiaPlugin, useGSAP };
