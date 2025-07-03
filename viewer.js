function loadSite() {
  const url = document.getElementById("urlInput").value.trim();
  if (!url.startsWith("http")) {
    alert("http または https で始まるURLを入力してください");
    return;
  }
  document.getElementById("siteViewer").src = url;
}
