document.addEventListener("DOMContentLoaded", () => {
  const installBtn = document.getElementById("installBtn");
  const linuxSelector = document.getElementById("linuxSelector");
  const linuxButtons = linuxSelector.querySelectorAll("button[data-format]");

  const downloads = {
    windows: "https://yourdomain.com/downloads/yourapp.exe",
    mac:     "https://yourdomain.com/downloads/yourapp.dmg",
    android: "https://yourdomain.com/downloads/yourapp.apk",
    linux: {
      deb:      "https://yourdomain.com/downloads/yourapp.deb",
      appimage: "https://yourdomain.com/downloads/yourapp.AppImage",
      tar:      "https://yourdomain.com/downloads/yourapp.tar.gz"
    },
    fallback: "https://krynet.ai"
  };

  const getOS = () => {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    if (/android/.test(ua)) return "android";
    if (platform.includes("mac")) return "mac";
    if (platform.includes("win")) return "windows";
    if (platform.includes("linux") || ua.includes("linux")) return "linux";
    return "unsupported";
  };

  const triggerDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  installBtn.addEventListener("click", () => {
    const os = getOS();

    switch (os) {
      case "windows":
        triggerDownload(downloads.windows);
        break;
      case "mac":
        triggerDownload(downloads.mac);
        break;
      case "android":
        triggerDownload(downloads.android);
        break;
      case "linux":
        linuxSelector.classList.add("visible-modal");
        break;
      default:
        window.location.href = downloads.fallback;
    }
  });

  linuxButtons.forEach(button => {
    button.addEventListener("click", () => {
      const format = button.getAttribute("data-format");
      const url = downloads.linux[format];
      if (url) {
        triggerDownload(url);
      } else {
        window.location.href = downloads.fallback;
      }
    });
  });
});
