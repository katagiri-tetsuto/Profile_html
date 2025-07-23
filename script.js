// スムーズスクロール機能
document.addEventListener("DOMContentLoaded", function () {
  // iframe内での表示を再度チェック
  try {
    if (window.self !== window.top) {
      // iframe内で表示されている場合の処理
      console.log("iframe内での表示が検出されました");

      // ページ内容を置き換え
      document.body.innerHTML =
        '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif; background: linear-gradient(135deg, #9966cc, #b19cd9); color: white; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">' +
        '<h1 style="margin-bottom: 30px;">このページは直接アクセスしてください</h1>' +
        '<p style="margin-bottom: 20px; font-size: 18px;">セキュリティ上の理由により、iframe内での表示はできません。</p>' +
        "<button onclick=\"window.open('https://nc.kcc.knowledgewing.com/kk/user/t.katagiri@jp.fujitsu.com', '_blank')\" style=\"background: white; color: #9966cc; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; margin: 10px; border: none; cursor: pointer;\">新しいタブでメインページを開く</button>" +
        "</div>";

      // 親ウィンドウの遷移は行わない（無限ループを防ぐため）
      // ただし、ユーザーが明示的にクリックした場合のみ新しいタブで開く

      return; // 以降の処理を停止
    }
  } catch (e) {
    console.log("iframe検出でエラーが発生:", e);
  }

  // 戻るボタンの表示制御
  const backButton = document.getElementById("backButton");

  // 常にボタンを表示
  backButton.style.display = "flex";

  // 戻る先情報を保存
  function saveReturnInfo() {
    try {
      if (document.referrer && document.referrer !== window.location.href) {
        localStorage.setItem("returnUrl", document.referrer);
      }
    } catch (error) {
      console.log("localStorage access failed:", error);
    }
  }

  // 戻る先情報を保存
  saveReturnInfo();

  // 戻るボタンのクリック処理
  backButton.addEventListener("click", function (e) {
    e.preventDefault();

    try {
      // iframe内での表示かチェック
      if (window.self !== window.top) {
        // iframe内の場合は新しいタブでのみ開く（親ウィンドウの遷移は行わない）
        try {
          window.open(
            "https://nc.kcc.knowledgewing.com/kk/user/t.katagiri@jp.fujitsu.com",
            "_blank"
          );
          return;
        } catch (error) {
          console.error("新しいタブで開けませんでした:", error);
          alert(
            "戻ることができませんでした。新しいタブでメインページを開いてください。"
          );
          return;
        }
      }

      // 通常のページ遷移（iframe外の場合）
      const returnUrl = localStorage.getItem("returnUrl");
      if (returnUrl && returnUrl.includes("nc.kcc.knowledgewing.com")) {
        window.location.href = returnUrl;
      } else {
        window.location.href =
          "https://nc.kcc.knowledgewing.com/kk/user/t.katagiri@jp.fujitsu.com";
      }
    } catch (error) {
      console.error("戻るボタンでエラーが発生しました:", error);
      // エラーが発生した場合の代替処理
      try {
        window.open(
          "https://nc.kcc.knowledgewing.com/kk/user/t.katagiri@jp.fujitsu.com",
          "_blank"
        );
      } catch (fallbackError) {
        console.error("代替処理でもエラーが発生しました:", fallbackError);
        alert(
          "戻ることができませんでした。新しいタブでメインページを開いてください。"
        );
      }
    }
  });

  // ナビゲーションリンクのクリック処理
  const navLinks = document.querySelectorAll(".nav-menu a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ヒーローボタンのクリック処理
  const heroButtons = document.querySelectorAll(".hero-buttons a");

  heroButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // スクロール時のナビゲーション背景変更
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(153, 102, 204, 0.95)";
      navbar.style.backdropFilter = "blur(10px)";
    } else {
      navbar.style.background = "linear-gradient(135deg, #9966cc, #b19cd9)";
      navbar.style.backdropFilter = "none";
    }
  });

  // スクロール時のアニメーション
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // アニメーション対象の要素を監視
  const animatedElements = document.querySelectorAll(
    ".work-card, .belief-card, .timeline-item, .skill-category"
  );

  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });

  // スキルタグのホバー効果
  const skillTags = document.querySelectorAll(".skill-tag");

  skillTags.forEach((tag) => {
    tag.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "transform 0.3s ease";
    });

    tag.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  // ソーシャルリンクと作品リンクのクリック処理
  const externalLinks = document.querySelectorAll(".social-link, .work-video");

  externalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // 外部リンクの場合は新しいタブで開く
      if (this.href && this.href.startsWith("http")) {
        e.preventDefault();
        window.open(this.href, "_blank");
      }
    });
  });

  // 作品カードのホバー効果
  const workCards = document.querySelectorAll(".work-card");

  workCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 10px 30px rgba(153, 102, 204, 0.2)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.boxShadow = "0 5px 20px rgba(153, 102, 204, 0.1)";
    });
  });

  // 信念カードのホバー効果
  const beliefCards = document.querySelectorAll(".belief-card");

  beliefCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 10px 30px rgba(153, 102, 204, 0.2)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.boxShadow = "0 5px 20px rgba(153, 102, 204, 0.1)";
    });
  });

  // レスポンシブメニュー（簡易版）
  const navbar = document.querySelector(".navbar");
  const navMenu = document.querySelector(".nav-menu");

  if (window.innerWidth <= 768) {
    // モバイル対応のメニュー表示制御
    let isMenuOpen = false;

    navbar.addEventListener("click", function () {
      if (isMenuOpen) {
        navMenu.style.display = "none";
        isMenuOpen = false;
      } else {
        navMenu.style.display = "flex";
        navMenu.style.flexDirection = "column";
        navMenu.style.position = "absolute";
        navMenu.style.top = "100%";
        navMenu.style.left = "0";
        navMenu.style.right = "0";
        navMenu.style.background = "rgba(153, 102, 204, 0.95)";
        navMenu.style.padding = "1rem";
        isMenuOpen = true;
      }
    });
  }
});

// ページ読み込み時のアニメーション
window.addEventListener("load", function () {
  document.body.style.opacity = "1";
  document.body.style.transition = "opacity 0.5s ease";
});

// 初期状態でボディを非表示にする
document.body.style.opacity = "0";
