import HomePage from "@/src/components/chat";

export default async function Page() {
  const backend_url = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(backend_url + "/providers", {
    headers: {
      "X-Bot-Secret": "shk245",
    },
  });
  const data = await response.json();
  console.log(data);

  return (
    <main>
      <HomePage />
    </main>
  );
}
