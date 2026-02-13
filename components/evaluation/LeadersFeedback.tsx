export default function LeadersFeedback({
  text,
}: {
  text: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-zinc-900 mb-4">Lider&apos;s Feedback</h3>

      <div className="border-l-4 border-blue-600 bg-zinc-50 rounded-lg p-4">
        <p className="text-sm text-zinc-700 leading-6">{text}</p>
      </div>
    </div>
  );
}
