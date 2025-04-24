const sections = document.querySelectorAll('.section');
const sidebarItems = document.querySelectorAll('.sidebar li');
        
sidebarItems.forEach(item => {
    sidebarItems.addEventListener('click', () => {
        const sectionName = item.getAttribute('data-section');
        showSection(sectionName);
    });
});
        
function showSection(sectionName) {
    sections.forEach(section => {
        if (section.getAttribute('data-section') === sectionName) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}