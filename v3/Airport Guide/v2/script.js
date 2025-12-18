document.addEventListener('DOMContentLoaded', () => {
    // ===== 导航高亮 =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // ===== 航站楼标签切换 =====
    // ===== 主航站楼选择切换 =====
    const mainTerminalTabs = document.querySelectorAll('.main-tab-btn');
    const mainTerminalContents = document.querySelectorAll('.main-terminal-content');

    mainTerminalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;

            // 更新主航站楼标签状态
            mainTerminalTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 更新主航站楼内容显示
            mainTerminalContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetId}-content`) {
                    content.classList.add('active');

                    // 重置该航站楼内的区域选择为第一个
                    const firstZoneBtn = content.querySelector('.zone-tab-btn');
                    const allZoneBtns = content.querySelectorAll('.zone-tab-btn');
                    const allZoneContents = content.querySelectorAll('.zone-content');

                    if (firstZoneBtn && allZoneBtns.length > 0) {
                        allZoneBtns.forEach(btn => btn.classList.remove('active'));
                        firstZoneBtn.classList.add('active');

                        const firstTargetId = firstZoneBtn.dataset.target;
                        allZoneContents.forEach(zoneContent => {
                            zoneContent.classList.remove('active');
                            if (zoneContent.id === `${firstTargetId}-zone`) {
                                zoneContent.classList.add('active');
                            }
                        });
                    }
                }
            });
        });
    });

// ===== 区域选择切换 =====
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('zone-tab-btn')) {
            const targetId = e.target.dataset.target;
            const parentContent = e.target.closest('.main-terminal-content');

            if (parentContent) {
                const zoneBtns = parentContent.querySelectorAll('.zone-tab-btn');
                const zoneContents = parentContent.querySelectorAll('.zone-content');

                // 更新区域标签状态
                zoneBtns.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // 更新区域内容显示
                zoneContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetId}-zone`) {
                        content.classList.add('active');
                    }
                });
            }
        }
    });


    // ===== 目的地标签切换 =====
    const destTabs = document.querySelectorAll('.dest-tab');
    const destContents = document.querySelectorAll('.destination-content');

    destTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;

            // 更新标签状态
            destTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 更新内容显示
            destContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetId}-content`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // ===== 交通指南标签切换 =====
    const guideTabs = document.querySelectorAll('.guide-tab');
    const guideSections = document.querySelectorAll('.guide-section');

    guideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;

            // 更新标签状态
            guideTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 更新内容显示
            guideSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetId}-content`) {
                    section.classList.add('active');
                }
            });
        });
    });

    // ===== 平滑滚动 =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== 卡片悬停效果增强 =====
    const cards = document.querySelectorAll('.prep-card, .transport-card, .terminal-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== 动态数字计数效果 =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateNumbers() {
        if (hasAnimated) return;

        statNumbers.forEach(element => {
            const finalValue = parseInt(element.textContent);
            let currentValue = 0;
            const increment = finalValue / 30;

            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    element.textContent = finalValue;
                    clearInterval(counter);
                } else {
                    element.textContent = Math.floor(currentValue);
                }
            }, 50);
        });

        hasAnimated = true;
    }

    // 观察器用于触发数字动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
            }
        });
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }

    // ===== 提示消息系统 =====
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // 样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px'
        });

        // 根据类型设置颜色
        const colors = {
            info: '#0ea5e9',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };

        toast.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // ===== 外部链接点击提示 =====
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', () => {
            showToast('正在打开外部链接...', 'info');
        });
    });

    // ===== 页面加载完成提示 =====
    showToast('新加坡樟宜机场入境攻略已加载完成！', 'success');

    // ===== 滚动到顶部按钮功能增强 =====
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            showToast('已返回页面顶部', 'info');
        });
    }

    // ===== 键盘导航支持 =====
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('#prep').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('#arrival').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('#transfer').scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    });

    // ===== 设备适配优化 =====
    function handleResize() {
        const isMobile = window.innerWidth < 768;
        const cards = document.querySelectorAll('.prep-card, .transport-card');

        if (isMobile) {
            cards.forEach(card => {
                card.style.margin = '0 auto';
                card.style.maxWidth = '100%';
            });
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // ===== 性能优化：图片懒加载（为将来的真实图片准备） =====
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // ===== 深色模式切换（预留功能） =====
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        showToast(`已切换到${isDark ? '深色' : '浅色'}模式`, 'info');
    }

    // 检查用户之前的设置
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // ===== 可访问性增强 =====
    // 为所有可交互元素添加键盘导航支持
    const interactiveElements = document.querySelectorAll('button, .tab-btn, .dest-tab, .guide-tab');

    interactiveElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });

    console.log('🛬 新加坡樟宜机场入境攻略已完全加载！');
});
