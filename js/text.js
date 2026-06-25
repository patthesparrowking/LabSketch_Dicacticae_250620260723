export function makeTextEditable(textElement) {
  textElement.addEventListener("dblclick", event => {
    event.stopPropagation();

    const oldText = textElement.textContent;
    const newText = prompt("Beschriftung ändern:", oldText);

    if (newText === null) return;

    textElement.textContent = newText.trim() || oldText;
  });
}