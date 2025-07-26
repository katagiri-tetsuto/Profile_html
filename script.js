// スムーズスクロール機能
document.addEventListener("DOMContentLoaded", function () {
  // ナビゲーションリンクのクリック処理
  const navLinks = document.querySelectorAll(".nav-menu a");

  // 下矢印ボタンのクリック処理も含める
  const scrollButtons = document.querySelectorAll(".nav-menu a, .arrow-btn");

  scrollButtons.forEach((link) => {
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

  // スクロール時のナビゲーション背景変更とアクティブセクションの検出
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-menu a");

    // ナビゲーションバーの背景変更
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(153, 102, 204, 0.95)";
      navbar.style.backdropFilter = "blur(10px)";
    } else {
      navbar.style.background = "linear-gradient(135deg, #9966cc, #b19cd9)";
      navbar.style.backdropFilter = "none";
    }

    // 現在のセクションをハイライト
    let currentSection = "";
    const navHeight = navbar.offsetHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    // ナビゲーションリンクのアクティブ状態を更新
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
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

  // キーボードナビゲーション（矢印キー）
  document.addEventListener("keydown", function (e) {
    const sections = [
      "home",
      "profile",
      "about",
      "belief",
      "works",
      "career",
      "skills",
    ];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);

    if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
      e.preventDefault();
      scrollToSection(sections[currentIndex + 1]);
    } else if (e.key === "ArrowUp" && currentIndex > 0) {
      e.preventDefault();
      scrollToSection(sections[currentIndex - 1]);
    }
  });

  // 現在のセクションを取得する関数
  function getCurrentSection() {
    const sections = document.querySelectorAll("section");
    const navHeight = document.querySelector(".navbar").offsetHeight;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        return section.getAttribute("id");
      }
    }
    return "home";
  }

  // セクションにスクロールする関数
  function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const navHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = targetElement.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }
});
