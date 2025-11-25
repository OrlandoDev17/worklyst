import Image from "next/image";

export default function AuthHeader({ title }) {
  return (
    <header className="flex flex-col items-center gap-1 mb-4">
      <Image src="/worklyst.svg" alt="Worklyst" width={150} height={150} />
      <p className="text-gray-600">{title} </p>
    </header>
  );
}
