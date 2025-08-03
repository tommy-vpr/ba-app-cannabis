export async function hubspotRequest(
  url: string,
  method: "GET" | "POST" = "GET",
  paramsOrBody?: Record<string, any>
): Promise<any> {
  const BASE_URL = process.env.LITTO_HUBSPOT_API_BASE!;
  const HUBSPOT_API_KEY = process.env.LITTO_HUBSPOT_ACCESS_TOKEN;

  if (!HUBSPOT_API_KEY) {
    throw new Error(
      "HUBSPOT_ACCESS_TOKEN is not defined in environment variables."
    );
  }

  let fullUrl = `${BASE_URL}${url}`;

  let body: string | undefined;

  if (method === "GET" && paramsOrBody?.properties) {
    const query = paramsOrBody.properties
      .map((p: string) => `properties=${p}`)
      .join("&");
    fullUrl += `?${query}`;
  } else if (method === "POST") {
    body = JSON.stringify(paramsOrBody);
  }

  const res = await fetch(fullUrl, {
    method,
    headers: {
      Authorization: `Bearer ${HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error(`HubSpot API error: ${res.status} - ${errorData}`);
    throw new Error(`HubSpot API request failed: ${res.status}`);
  }

  return res.json();
}
