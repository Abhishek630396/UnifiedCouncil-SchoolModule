export function submitCcaVenueForm({ paymentUrl, encRequest, accessCode }) {
  if (!paymentUrl || !encRequest || !accessCode) {
    throw new Error("CCAvenue did not return complete payment details.");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;
  form.style.display = "none";

  for (const [name, value] of [
    ["encRequest", encRequest],
    ["access_code", accessCode],
  ]) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
