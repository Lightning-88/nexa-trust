import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex justify-center items-center h-dvh">
      <Card className="w-full max-w-sm">
        <CardContent>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
