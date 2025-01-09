export async function submitPrompt(inputValue: string) {
  // 
  const response = await fetch("https://social-anlysis.vercel.app/run-flow", 
   
   {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputValue }),
  });
  
  console.log(response);
  
  const data = await response.json();
  console.log("data " ,data);
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.message, "text/html");
  console.log(doc);
  
  const divElement = doc.querySelector("div");
  
  return divElement?.innerHTML || '';
}