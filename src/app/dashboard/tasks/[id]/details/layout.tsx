
import { TasksLayout } from 'src/sections/tasks/task-layout';

type LayoutProps = {
  children: React.ReactNode;
  params: { id: string };
};

const AccountLayoutWrapper = async ({ children, params }: LayoutProps) => {
  const { id } = params;
  return <TasksLayout customerId={id}>{children}</TasksLayout>;
};

export default AccountLayoutWrapper;
