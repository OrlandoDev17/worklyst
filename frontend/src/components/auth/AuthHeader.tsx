interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-2">
      <h2 className="text-2xl font-medium">{title}</h2>
      <p className="text-gray-800 text-center">{description}</p>
    </header>
  );
}
