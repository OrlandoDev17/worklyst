import { TasksContainer } from "@/components/tasks/TasksContainer";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return (
    <main>
      <TasksContainer projectId={id} />
    </main>
  );
}
