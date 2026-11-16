import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="container-page py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page doesn&apos;t exist.</h1>
      <Link to="/" className="btn-primary mt-8">
        Back home
      </Link>
    </section>
  );
}
