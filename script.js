document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const submitButton = document.querySelector("button[type='submit']");
  submitButton.disabled = true;

  let code = document.querySelector("textarea[name='code']").value;
  code += " dont change anything just fix syntax also tell what u changes u made";

  const response = await fetch('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  document.querySelector("form").style.display = "none";

  const data = await response.json();
  const rawText = data.text || "";

  const match = rawText.match(/```(?:\w*\n)?([\s\S]*?)```/);
  const extractedCode = match ? match[1] : rawText;

  const nonCodeText = rawText.replace(/```(?:\w*\n)?[\s\S]*?```/, '').trim();

  // Create container divs
  let resultsContainer = document.createElement('div');
  resultsContainer.id = "results-container";

  let buttonsContainer = document.createElement('div');
  buttonsContainer.id = "buttons-container";

  // --- Code Box ---
  let codeBox = document.createElement('div');
  codeBox.style.display = "flex";
  codeBox.style.flexDirection = "column";
  codeBox.style.width = "45vw";

  // Header for Code box with Copy button
  let codeHeader = document.createElement('div');
  codeHeader.style.display = "flex";
  codeHeader.style.justifyContent = "space-between";
  codeHeader.style.alignItems = "center";
  codeHeader.style.marginBottom = "8px";

  let codeTitle = document.createElement('h2');
  codeTitle.innerText = "Code";
  codeTitle.style.margin = "0";
  codeTitle.style.color = "#00ffff";

  let copy = document.createElement('button');
  copy.innerText = "Copy";
  copy.style.padding = "6px 12px";
  copy.style.cursor = "pointer";
  copy.style.width="5vw";
  copy.addEventListener("click", function () {
    navigator.clipboard.writeText(extractedCode);
    copy.innerText = "Copied";
    setTimeout(() => (copy.innerText = "Copy"), 2000);
  });

  codeHeader.appendChild(codeTitle);
  codeHeader.appendChild(copy);

  // Code textarea
  let result = document.createElement('textarea');
  result.classList.add('dynamic-textarea');
  result.value = extractedCode;
  result.readOnly=true;
  codeBox.appendChild(codeHeader);
  codeBox.appendChild(result);
  codeBox.style.fontFamily = "'Fira Mono', monospace";
  // --- Changes Box ---
  let changesBox = document.createElement('div');
  changesBox.style.display = "flex";
  changesBox.style.flexDirection = "column";
  changesBox.style.width = "45vw";

  // Header for Changes box
  let changesHeader = document.createElement('h2');
  changesHeader.innerText = "Changes";
  changesHeader.style.marginBottom = "8px";
  changesHeader.style.color = "#00ffff";

  // Changes textarea
  let changes = document.createElement('textarea');
  changes.classList.add('dynamic-textarea');
  changes.value = nonCodeText;
  changes.readOnly=true;
  changesBox.appendChild(changesHeader);
  changesBox.appendChild(changes);
  changesBox.style.fontFamily = "'Fira Mono', monospace";


  // Append both boxes to results container
  resultsContainer.appendChild(codeBox);
  resultsContainer.appendChild(changesBox);

  // Reset button
  let reset = document.createElement('button');
  reset.innerText = "Reset";
  reset.style.padding = "10px 20px";
  reset.style.cursor = "pointer";
  reset.addEventListener("click", function () {
    resultsContainer.remove();
    buttonsContainer.remove();
    document.querySelector("form").style.display = "block";
    submitButton.disabled = false;
    document.querySelector("textarea[name='code']").value = "";
  });

  buttonsContainer.appendChild(reset);

  // Append containers to body
  document.body.appendChild(resultsContainer);
  document.body.appendChild(buttonsContainer);
});
