(function (e) {
    "use strict";

    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome = /chrome/.test(userAgent) && !/edge|edg|opr/.test(userAgent);
    const isFirefox = /firefox/.test(userAgent);
    const isWebkit = /webkit/.test(userAgent);
    const defaultPopOptions = {
        cookieExpires: null,
        cookiePath: "/",
        newTab: true,
        blur: true,
        chromeDelay: 500,
        beforeOpen: () => {},
        afterOpen: () => {},
    };

    const helpers = {
        simulateClick(url) {
            const anchor = document.createElement("a");
            const event = new MouseEvent("click", { bubbles: true, cancelable: true });
            anchor.href = url || "about:blank";
            document.body.appendChild(anchor);
            anchor.dispatchEvent(event);
            anchor.parentNode.removeChild(anchor);
        },
        blurWindow() {
            try {
                if (isFirefox) {
                    const blankWindow = window.open("about:blank", "_blank");
                    blankWindow.close();
                } else if (isWebkit) {
                    window.focus();
                } else {
                    setTimeout(() => window.focus(), 100);
                }
            } catch (err) {
                console.error("Error blurring window:", err);
            }
        },
        setCookie(name, value, expires, path = "/") {
            let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;
            if (expires) {
                const expiryDate = new Date(Date.now() + expires * 1000);
                cookieString += `; expires=${expiryDate.toUTCString()}`;
            }
            document.cookie = cookieString;
        },
        getCookie(name) {
            const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
            return match ? decodeURIComponent(match[2]) : null;
        },
    };

    class PopupHandler {
        constructor(url, options = {}) {
            this.url = url;
            this.options = { ...defaultPopOptions, ...options };
            this.executed = false;
        }

        execute() {
            if (this.executed) return;

            this.options.beforeOpen();

            if (this.options.newTab) {
                if (isChrome) {
                    helpers.simulateClick(this.url);
                } else {
                    window.open(this.url, "_blank");
                }
            } else {
                window.open(this.url, "_self");
            }

            this.executed = true;
            this.options.afterOpen();
        }
    }

    // Example usage:
    const popup = new PopupHandler("https://s.shopee.co.id/5VEv5XStdP", {
        newTab: true,
        beforeOpen: () => console.log("Popup about to open"),
        afterOpen: () => console.log("Popup opened"),
    });

    document.addEventListener("DOMContentLoaded", () => {
        document.body.addEventListener("click", () => popup.execute());
    });
})(window);
