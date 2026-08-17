interface ErrorDashboardProps {
  error: string;
}

export default function ErrorDashboard({ error }: ErrorDashboardProps) {
  return <div className="rounded-2xl bg-red-50 p-5 text-red-600">{error}</div>;
}
