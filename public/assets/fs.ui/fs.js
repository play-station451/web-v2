const breadcrumbsEl = document.querySelector('.breadcrumbs');
const navBackEl = document.querySelector('.nav-back');
const navHomeEl = document.querySelector('.nav-home');
const url = new URL(window.location.href);

var breadcrumbs = []
var currentPath = url.pathname.replace(/\/+/g, '/');
var currentDir = currentPath.split('/').pop();
if (currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
}

if (currentPath !== '/fs') {
    breadcrumbs = currentPath.split('/').slice(2);
    const fsIndex = breadcrumbs.indexOf('fs');
    if (fsIndex !== -1) {
        breadcrumbs.splice(fsIndex, 1);
    }
}

const updateBreadcrumbs = () => {
    breadcrumbsEl.innerHTML = '';
    if(currentPath === '/fs') {
        const rootHolderEl = document.createElement('span');
        rootHolderEl.classList = 'flex leading-none text-2xl text-[#ffffffff]';
        rootHolderEl.textContent = 'root';
        breadcrumbsEl.appendChild(rootHolderEl);
        return
    }
    breadcrumbs.forEach((crumb, index) => {
        if(index > 12) return;
        if(index > 0) {
            const separatorEl = document.createElement('span');
            separatorEl.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 stroke-2 stroke-current">
                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                </svg>
            `
            separatorEl.classList = 'flex leading-none justify-center items-center dark:text-[#ffffff68] text-[#00000088]';
            breadcrumbsEl.appendChild(separatorEl);
        }

        const crumbEl = document.createElement('div');
        crumbEl.textContent = crumb;
        if (index !== breadcrumbs.length - 1) {
            crumbEl.classList = 'flex leading-none p-1.5 text-lg dark:text-[#ffffffd5] dark:hover:text-[#fffffff8] dark:bg-[#ffffff18] dark:inset-shadow-[0_0_0_0.5px_#ffffff38] text-[#00000098] hover:text-[#000000] bg-[#00000025] inset-shadow-[0_0_0_1px_#00000068] rounded-md duration-150 cursor-(--cursor-pointer)';
            crumbEl.onmousedown = (e) => {
                e.preventDefault();
                if (e.button === 0) {
                    const newPath = breadcrumbs.slice(0, index + 1).join('/');
                    window.location.href = `/fs/${newPath}`;
                }
            }
        } else {
            crumbEl.classList = 'flex leading-none p-1.5 text-lg dark:text-[#ffffffd5] dark:bg-[#ffffff18] dark:inset-shadow-[0_0_0_0.5px_#ffffff38] text-[#00000098] bg-[#00000025] inset-shadow-[0_0_0_1px_#00000068] rounded-md duration-150';
        }
        crumbEl.classList.add("select-none");
        breadcrumbsEl.appendChild(crumbEl);
    });
}
updateBreadcrumbs();

navBackEl.onmousedown = (e) => {
    e.preventDefault();
    if(currentPath === '/fs') return;
    if (e.button === 0) {
        if(breadcrumbs.length > 0) {
            breadcrumbs.pop();
            const newPath = breadcrumbs.join('/');
            window.location.href = `/fs/${newPath}`;
        } else {
            window.location.href = '/fs/';
        }
    }
}

navHomeEl.onmousedown = (e) => {
    e.preventDefault();
    if(currentPath === '/fs') return;
    if (e.button === 0) {
        window.location.href = '/fs/';
    }
}