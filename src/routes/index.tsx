import { PromptInput } from "@/components/chat/prompt-input";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: MainPage,
});

function MainPage() {
  return (
    <div>
      <h1>
        <Link to="/login">Login</Link>
      </h1>
      <PromptInput onLoading={false} />
    </div>
  );
}
