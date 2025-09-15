/* 항상 최상단으로 */
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

/* 헤더 고정 스타일 토글 */
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 0) header.classList.add('fix');
  else header.classList.remove('fix');
});

/* GNB (데스크톱: 호버 / 모바일: 토글) */
const mainMenu = document.querySelectorAll('.gnb>ul>li');

const enterFunc = (e) => {
  const sub = e.currentTarget.querySelector('.sub');
  if (sub) sub.style.display = 'block';
};
const leaveFunc = (e) => {
  const sub = e.currentTarget.querySelector('.sub');
  if (sub) sub.style.display = 'none';
};
const bindMenuByWidth = () => {
  if (window.innerWidth >= 1200) {
    mainMenu.forEach((li) => {
      li.addEventListener('mouseenter', enterFunc);
      li.addEventListener('mouseleave', leaveFunc);
    });
  } else {
    mainMenu.forEach((li) => {
      li.removeEventListener('mouseenter', enterFunc);
      li.removeEventListener('mouseleave', leaveFunc);
    });
  }
};
bindMenuByWidth();
window.addEventListener('resize', bindMenuByWidth);

/* 모바일 사이드 메뉴 토글 */
const toggle = document.querySelector('.toggle');
const gnb = document.querySelector('.gnb');
const bg = document.querySelector('.black_bg');
const gnbClose = document.querySelector('.close');
let toggleState = true;

toggle.addEventListener('click', () => {
  if (toggleState) {
    gnb.style.left = 0;
    bg.style.display = 'block';
    bg.style.zIndex = 99998;
  } else {
    gnb.style.left = '-70vw';
    bg.style.display = 'none';
  }
  toggleState = !toggleState;
});
gnbClose.addEventListener('click', () => {
  gnb.style.left = '-70vw';
  bg.style.display = 'none';
  toggleState = true;
});

/* 모바일에서 2번째 메뉴(다이닝) 클릭 시 서브 토글 */
mainMenu.forEach((li, index) => {
  if (index === 1) {
    li.querySelector('a').addEventListener('click', (e) => {
      if (window.innerWidth < 1200) {
        const sub = e.currentTarget.nextElementSibling;
        if (sub) {
          e.preventDefault();
          sub.style.display = (sub.style.display === 'block') ? 'none' : 'block';
        }
      }
    });
  }
});

/* 검색 레이어 */
const searchForm = document.querySelector('#searchForm');
searchForm.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchForm.submit();
  }
});
const searchOpen = document.querySelector('.icons_top ul li a');
const searchArea = document.querySelector('.search_area');
const searchClose = document.querySelector('.search_area #close');
if (searchOpen) {
  searchOpen.addEventListener('click', (e) => {
    e.preventDefault();
    searchArea.style.display = 'flex';
  });
}
if (searchClose) {
  searchClose.addEventListener('click', () => {
    searchArea.style.display = 'none';
  });
}

/* ===== Swiper + GSAP ===== */
document.addEventListener('DOMContentLoaded', function () {
  /* 히어로 타이틀 텍스트 애니메이션 */
  const animateText = (text) => {
    if (!text) return;
    const letters = text.textContent.split('');
    text.innerHTML = '';
    letters.forEach((letter) => {
      const span = document.createElement('span');
      span.innerHTML = (letter === ' ') ? '&nbsp;' : letter;
      span.style.display = 'inline-block';
      text.appendChild(span);
    });
    const spans = text.querySelectorAll('span');
    spans.forEach((span, index) => {
      gsap.set(span, { opacity: 0, y: 60, display: 'inline-block' });
      gsap.to(span, {
        duration: 0.8, opacity: 1, y: 0,
        delay: (index + 1) * 0.08, ease: 'power2.out', overwrite: 'auto'
      });
    });
  };

  /* 1) 히어로 슬라이더 (#slide_container) */
  const heroSlidesCount = document.querySelectorAll('#slide_container .swiper .swiper-slide').length;
  const heroSwiper = new Swiper('#slide_container .swiper', {
    autoplay: { delay: 8000 },
    loop: heroSlidesCount > 1,
    pagination: {
      el: '#slide_container .swiper-pagination',
      clickable: true,
    },
    on: {
      slideChange: function () {
        const currentText = this.slides[this.activeIndex].querySelector('.text_content');
        animateText(currentText);
      }
    }
  });

  /* 첫 텍스트 애니메이션 */
  const initText = document.querySelector('#slide_container .swiper .swiper-slide-active .text_content');
  animateText(initText);

  /* 2) 이미지 등장 애니메이션 (객실 섹션) */
  const imgWrappers = document.querySelectorAll('.imgs_wrap');
  imgWrappers.forEach((wrapper) => {
    const imgs = wrapper.querySelectorAll('img');
    imgs.forEach((img) => {
      img.dataset.originWidth = img.offsetWidth;
      img.dataset.originHeight = img.offsetHeight;
      gsap.set(img, { width: 0, opacity: 0, height: img.offsetHeight, transformOrigin: 'left center' });
    });
    gsap.to(imgs, {
      width: (_, target) => target.dataset.originWidth,
      opacity: 1,
      ease: 'power4.in',
      stagger: 0.2,
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 90%',
        end: 'top 70%',
        scrub: 2,
        toggleActions: 'restart pause reverse pause',
      }
    });
  });

  /* 3) 다이닝 카드 행 단위 페이드업 */
  const amenities = document.querySelectorAll('#Amenity .content_wrap>div');
  const rows = [];
  amenities.forEach((item, index) => {
    const rowIndex = Math.floor(index / 3);
    rows[rowIndex] = rows[rowIndex] || [];
    rows[rowIndex].push(item);
  });
  rows.forEach((row) => {
    gsap.from(row, {
      opacity: 0, y: 100, duration: 1,
      scrollTrigger: {
        trigger: row[0],
        start: 'top 70%',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
        onEnter: () => gsap.to(row, { opacity: 1, y: 0, overwrite: true }),
        onLeaveBack: () => gsap.to(row, { opacity: 1, y: 0, overwrite: true })
      }
    });
  });

 });
