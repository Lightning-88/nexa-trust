import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/c/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatId } = Route.useParams();

  return (
    <div>
      Hello "/(main)/c/$chatId"! <p>{chatId}</p>
    </div>
  );
}
