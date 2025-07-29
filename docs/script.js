// スムーズスクロール機能
document.addEventListener("DOMContentLoaded", function () {
  // Three.js 3Dオブジェクトのセットアップ
  initThreeJS();

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

// Three.js初期化関数
function initThreeJS() {
  const container = document.getElementById("threejs-container");
  if (!container) return;

  // コンテナのサイズを親要素（hero section）に合わせる
  const heroSection = document.querySelector(".hero");
  const containerWidth = heroSection.offsetWidth;
  const containerHeight = heroSection.offsetHeight;

  // シーン、カメラ、レンダラーの作成
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    containerWidth / containerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(containerWidth, containerHeight);
  renderer.setClearColor(0x000000, 0.1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // ライティングの設定
  const ambientLight = new THREE.AmbientLight(0x9966cc, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xb19cd9, 0.5, 100);
  pointLight.position.set(-10, 10, -10);
  scene.add(pointLight);

  // GLTFLoaderでBackrooms_tem.glbを読み込み
  const loader = new THREE.GLTFLoader();
  let model = null;

  loader.load(
    "../3D_Objects/Backrooms_tem.glb",
    function (gltf) {
      model = gltf.scene;

      // モデルのスケールと位置を調整
      model.scale.set(1, 1, 1);
      model.position.set(0, -1, 0);

      // モデルに影を設定
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);
      console.log("Backrooms model loaded successfully");
    },
    function (progress) {
      console.log(
        "Loading progress: " + (progress.loaded / progress.total) * 100 + "%"
      );
    },
    function (error) {
      console.error("Error loading Backrooms model:", error);
      // エラー時にはフォールバック用のシンプルなジオメトリを表示
      createFallbackGeometry();
    }
  );

  // フォールバック用のジオメトリ
  function createFallbackGeometry() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshLambertMaterial({
      color: 0x9966cc,
      transparent: true,
      opacity: 0.8,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    model = cube;
  }

  // カメラの初期位置
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 0, 0);

  // マウス制御のための変数
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  // マウスムーブメントイベント（ヒーローセクション全体で反応）
  const heroSection = document.querySelector(".hero");
  heroSection.addEventListener("mousemove", function (event) {
    const rect = heroSection.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / heroSection.offsetWidth) * 2 - 1;
    mouseY = -((event.clientY - rect.top) / heroSection.offsetHeight) * 2 + 1;

    targetRotationY = mouseX * 0.5;
    targetRotationX = mouseY * 0.3;
  });

  // マウスリーブイベント
  heroSection.addEventListener("mouseleave", function () {
    targetRotationX = 0;
    targetRotationY = 0;
  });

  // アニメーションループ
  function animate() {
    requestAnimationFrame(animate);

    // モデルの自動回転
    if (model) {
      model.rotation.y += 0.005;

      // マウスによる追加回転（スムーズに）
      model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
      model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
    }

    // カメラの軽微な動き
    camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
    camera.position.y = 2 + Math.cos(Date.now() * 0.0003) * 0.2;

    renderer.render(scene, camera);
  }

  animate();

  // ウィンドウリサイズ対応
  window.addEventListener("resize", function () {
    const width = heroSection.offsetWidth;
    const height = heroSection.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });
}
