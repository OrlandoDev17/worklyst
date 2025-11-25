import gsap from "gsap";

export const FadeUp = () => {
  gsap.from(".fade-up", {
    opacity: 0,
    y: 50,
    duration: 0.5,
    ease: "back.out",
  });
};
