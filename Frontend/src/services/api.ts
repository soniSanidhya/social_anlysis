export async function submitPrompt(inputValue: string) {
  const response = await fetch("https://social-anlysis.vercel.app/run-flow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputValue }),
  });
  
  const data = await response.json();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");
  const divElement = doc.querySelector("div");
  
  return divElement?.innerHTML || '';
}