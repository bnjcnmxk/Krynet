<script>
document.addEventListener("DOMContentLoaded", () => {
    const installBtn = document.getElementById("installBtn");
    const linuxSelector = document.getElementById("linuxSelector");
    const linuxButtons = linuxSelector.querySelectorAll("button[data-format]");

    // Links
    const downloads = {
        windows: "https://yourdomain.com/downloads/yourapp.exe",
        mac:     "https://yourdomain.com/downloads/yourapp.dmg",
        android: {
            apk:       "https://yourdomain.com/downloads/yourapp.apk",
            playstore: "https://play.google.com/store/apps/details?id=your.app.id"
        },
        linux: {
            deb:      "https://yourdomain.com/downloads/yourapp.deb",
            appimage: "https://yourdomain.com/downloads/yourapp.AppImage",
            tar:      "https://yourdomain.com/downloads/yourapp.tar.gz"
        },
        fallback: "https://krynet.ai"
    };

    // OS Detection
    const getOS = () => {
        const ua = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();

        if (/android/.test(ua)) return "android";
        if (platform.includes("mac")) return "mac";
        if (platform.includes("win")) return "windows";
        if (platform.includes("linux") || ua.includes("linux")) return "linux";
        return "unsupported";
    };

    const getAndroidVersion = () => {
        const match = navigator.userAgent.toLowerCase().match(/android\s([0-9\.]+)/);
        if (match && match[1]) return parseInt(match[1].split(".")[0], 10);
        return null;
    };

    const triggerDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Main Install Button Logic
    installBtn.addEventListener("click", () => {
        const os = getOS();

        switch (os) {
            case "windows":
                triggerDownload(downloads.windows);
                break;

            case "mac":
                triggerDownload(downloads.mac);
                break;

            case "linux":
                linuxSelector.style.display = "block";
                break;

            case "android":
                const version = getAndroidVersion();
                if (version && version >= 10) {
                    triggerDownload(downloads.android.apk);
                } else {
                    window.location.href = downloads.android.playstore;
                }
                break;

            default:
                window.location.href = downloads.fallback;
        }
    });

    // Linux Buttons Handler
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
</script>
