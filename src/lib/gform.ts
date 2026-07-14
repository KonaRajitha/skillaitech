// Submits signup data to the Skill.AI Google Form.
// Fire-and-forget: uses no-cors so we don't rely on the response.
const FORM_ID = "1FAIpQLSdxZRVKe7KcirpXLuemMBIh49bdojXOJBj6LDpAh60IcxvslA";
const ENTRIES = {
  fullName: "entry.1056394380",
  phone: "entry.431587138",
  email: "entry.380752233",
  password: "entry.615994355",
} as const;

export async function submitSignupToGoogleForm(data: {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}) {
  const body = new URLSearchParams();
  body.append(ENTRIES.fullName, data.fullName);
  body.append(ENTRIES.phone, data.phone);
  body.append(ENTRIES.email, data.email);
  body.append(ENTRIES.password, data.password);

  try {
    await fetch(`https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  } catch {
    // no-cors always resolves opaque; ignore
  }
}
