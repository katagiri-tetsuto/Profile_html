// スムーズスクロール機能
document.addEventListener("DOMContentLoaded", function () {
  // Three.js 3Dオブジェクトのセットアップ
  initThreeJS();

  // カルーセル機能のセットアップ
  initCarousel();

  // スコア評価基準パネルのセットアップ
  initScoreCriteriaPanel();

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

    // topセクション以外に移動したときに操作方法ガイドを非表示にする
    // topセクションに戻ったときは再表示する（ただし操作が有効な場合のみ）
    const controlsGuide = document.getElementById("controls-guide");
    if (controlsGuide) {
      if (currentSection !== "home") {
        controlsGuide.classList.add("hidden");
      } else if (currentSection === "home" && isControlsEnabled) {
        controlsGuide.classList.remove("hidden");
      }
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

  // stacksセクションの監視を追加（スコア評価基準パネル用）
  const stacksSection = document.querySelector(".stacks-section");
  if (stacksSection) {
    const stacksObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          const scoreCriteriaPanel = document.getElementById(
            "score-criteria-panel"
          );
          if (scoreCriteriaPanel) {
            if (entry.isIntersecting) {
              scoreCriteriaPanel.classList.add("visible");
            } else {
              scoreCriteriaPanel.classList.remove("visible", "show");
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    stacksObserver.observe(stacksSection);

    // 初期状態でStacksセクションが既に画面内にある場合をチェック
    const rect = stacksSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      const scoreCriteriaPanel = document.getElementById(
        "score-criteria-panel"
      );
      if (scoreCriteriaPanel) {
        scoreCriteriaPanel.classList.add("visible");
      }
    }
  } // スキルタグのホバー効果
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

  // The Backroomsの作品にスクロールする関数
  function scrollToBackrooms() {
    const backroomsElement = document.querySelector(".work-item-third");
    if (backroomsElement) {
      const navHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = backroomsElement.offsetTop - navHeight - 20; // 少し余裕を持たせる

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
  renderer.setClearColor(0x000033, 1.0); // 濃い青色に変更
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  console.log(
    "Renderer initialized with size:",
    containerWidth,
    "x",
    containerHeight
  );
  console.log("Canvas added to container");

  // ライティングの設定
  const ambientLight = new THREE.AmbientLight(0x9966cc, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = false;
  // directionalLight.shadow.mapSize.width = 2048;
  // directionalLight.shadow.mapSize.height = 2048;

  // // シャドウカメラの設定を追加して紫色の正方形を修正
  // directionalLight.shadow.camera.near = 0.1;
  // directionalLight.shadow.camera.far = 50;
  // directionalLight.shadow.camera.left = -20;
  // directionalLight.shadow.camera.right = 20;
  // directionalLight.shadow.camera.top = 20;
  // directionalLight.shadow.camera.bottom = -20;

  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xb19cd9, 0.5, 100);
  pointLight.position.set(-10, 10, -10);
  scene.add(pointLight);

  console.log("Three.js scene initialized with lighting");
  console.log("Scene children count:", scene.children.length);

  // GLTFLoaderでBackrooms_tem.glbを読み込み
  const loader = new THREE.GLTFLoader();
  let model = null;

  console.log("Attempting to load GLB file from: 3D_Objects/Backrooms_tem.glb");

  loader.load(
    "3D_Objects/Backrooms_tem.glb",
    function (gltf) {
      console.log("GLB file loaded successfully:", gltf);
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
      console.log("Backrooms_tem model added to scene successfully");
      console.log(
        "Scene children count after adding model:",
        scene.children.length
      );
    },
    function (progress) {
      console.log(
        "Loading progress: " +
          Math.round((progress.loaded / progress.total) * 100) +
          "%"
      );
    },
    function (error) {
      console.error("Error loading Backrooms_tem model:", error);
      console.log("Creating fallback geometry instead");
      // エラー時にはフォールバック用のシンプルなジオメトリを表示
      createFallbackGeometry();
    }
  );

  // フォールバック用のジオメトリ（削除）
  function createFallbackGeometry() {
    console.log("Creating fallback geometry");
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ff00, // 緑色に変更して見やすく
      transparent: true,
      opacity: 0.8,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    model = cube;
    console.log("Fallback cube added to scene");
    console.log("Total objects in scene:", scene.children.length);
  }

  // カメラの初期位置
  camera.position.set(0, 2, 8);
  camera.lookAt(0, 0, 0);

  // マウス制御のための変数
  let isMouseDown = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  // カメラ制御のための変数
  let cameraDistance = 8;
  let cameraAngleX = 0;
  let cameraAngleY = 0;
  const minDistance = 2;
  const maxDistance = 15;

  // 操作制御のための変数
  let isControlsEnabled = false;

  // マウスホイールでズーム機能
  function handleWheel(event) {
    if (!isControlsEnabled) return;

    event.preventDefault();

    const zoomSpeed = 0.3;
    const deltaY = event.deltaY;

    // 現在のカメラ位置から原点へのベクトルを計算
    const currentPosition = camera.position.clone();
    const direction = currentPosition.clone().normalize();

    // ズーム方向を決定
    if (deltaY > 0) {
      // ズームアウト：原点から離れる方向
      const newPosition = currentPosition
        .clone()
        .add(direction.multiplyScalar(zoomSpeed));
      const newDistance = newPosition.length();

      if (newDistance <= maxDistance) {
        camera.position.copy(newPosition);
        cameraDistance = newDistance;
      }
    } else {
      // ズームイン：原点に近づく方向
      const newPosition = currentPosition
        .clone()
        .sub(direction.multiplyScalar(zoomSpeed));
      const newDistance = newPosition.length();

      if (newDistance >= minDistance) {
        camera.position.copy(newPosition);
        cameraDistance = newDistance;
      }
    }

    // ターゲットを見続ける
    camera.lookAt(0, 0, 0);
  }

  // マウスホイールボタンでの視点回転
  function handleMouseDown(event) {
    if (!isControlsEnabled) return;

    if (event.button === 1) {
      // マウスホイールボタン（中ボタン）
      event.preventDefault();
      isMouseDown = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      heroSection.style.cursor = "grabbing";
    }
  }

  function handleMouseMove(event) {
    if (!isControlsEnabled || !isMouseDown) return;

    event.preventDefault();

    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;

    const rotationSpeed = 0.005;
    cameraAngleY += deltaX * rotationSpeed;
    cameraAngleX += deltaY * rotationSpeed;

    // X軸回転を制限（上下の制限）
    cameraAngleX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraAngleX));

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    updateCameraPosition();
  }

  function handleMouseUp(event) {
    if (!isControlsEnabled) return;

    if (event.button === 1) {
      // マウスホイールボタン
      isMouseDown = false;
      heroSection.style.cursor = "default";
    }
  }

  function handleMouseLeave() {
    if (!isControlsEnabled) return;

    isMouseDown = false;
    heroSection.style.cursor = "default";
  }

  function handleContextMenu(event) {
    if (!isControlsEnabled) return;

    event.preventDefault();
  }

  // イベントリスナーを追加
  heroSection.addEventListener("wheel", handleWheel);
  heroSection.addEventListener("mousedown", handleMouseDown);
  heroSection.addEventListener("mousemove", handleMouseMove);
  heroSection.addEventListener("mouseup", handleMouseUp);
  heroSection.addEventListener("mouseleave", handleMouseLeave);
  heroSection.addEventListener("contextmenu", handleContextMenu);

  // 操作を有効にする関数
  window.enableControls = function () {
    isControlsEnabled = true;

    // 自動ズーム（少し近づく）
    const targetDistance = 5; // 現在の5から3に変更
    const zoomDuration = 1000; // 1秒でズーム
    const startDistance = cameraDistance;
    const startTime = Date.now();

    function animateZoom() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / zoomDuration, 1);

      // イージング関数（スムーズな動き）
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      cameraDistance =
        startDistance + (targetDistance - startDistance) * easeProgress;
      updateCameraPosition();

      if (progress < 1) {
        requestAnimationFrame(animateZoom);
      }
    }

    animateZoom();

    // 操作方法ポップアップを表示
    const controlsGuide = document.getElementById("controls-guide");
    if (controlsGuide) {
      controlsGuide.classList.remove("hidden");
    }
  };

  // カメラ位置更新関数
  function updateCameraPosition() {
    const x = cameraDistance * Math.sin(cameraAngleY) * Math.cos(cameraAngleX);
    const y = 2 + cameraDistance * Math.sin(cameraAngleX);
    const z = cameraDistance * Math.cos(cameraAngleY) * Math.cos(cameraAngleX);

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  }

  // アニメーションループ
  let frameCount = 0;
  function animate() {
    requestAnimationFrame(animate);

    frameCount++;
    if (frameCount % 60 === 0) {
      // 60フレームごとにログ出力
      console.log("Animation frame:", frameCount, "Model exists:", !!model);
    }

    // モデルの自動回転（操作が無効で、マウス操作がない場合のみ）
    if (model && !isControlsEnabled && !isMouseDown) {
      model.rotation.y += 0.003; // 回転速度を遅くする（0.005 → 0.002）
    }

    // カメラの軽微な動きを削除（手動制御を優先）
    // camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
    // camera.position.y = 2 + Math.cos(Date.now() * 0.0003) * 0.2;

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

// カルーセル機能
function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll(".interest-card");
  const cardWidth = 550; // width of interest-card (updated size)
  const slideWidth = cardWidth; // No gap needed for single card display

  let currentIndex = 0;
  const maxIndex = Math.max(0, cards.length - 1); // Show 1 card at a time

  function updateCarousel() {
    const offset = -currentIndex * slideWidth;
    track.style.transform = `translateX(${offset}px)`;

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Initialize carousel
  updateCarousel();
}

// スコア評価基準パネル機能
function initScoreCriteriaPanel() {
  const panel = document.getElementById("score-criteria-panel");
  const toggle = document.getElementById("score-criteria-toggle");

  if (!panel || !toggle) return;

  let isOpen = false;

  toggle.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      panel.classList.add("show");
    } else {
      panel.classList.remove("show");
    }
  });

  // パネル外をクリックした時に閉じる
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && isOpen) {
      isOpen = false;
      panel.classList.remove("show");
    }
  });

  // パネル内のクリックイベントを停止（バブリングを防ぐ）
  panel.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// ポップアップを閉じる関数
function closeHeroPopup() {
  const heroOverlay = document.querySelector(".hero-overlay");
  if (heroOverlay) {
    heroOverlay.style.display = "none";
  }

  // 操作を有効にする
  if (window.enableControls) {
    window.enableControls();
  }
}

// ページ読み込み時に操作方法ポップアップの閉じるボタンイベントを設定
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("close-controls-guide");
  const controlsGuide = document.getElementById("controls-guide");

  if (closeBtn && controlsGuide) {
    closeBtn.addEventListener("click", function () {
      controlsGuide.classList.add("hidden");
    });
  }
});
