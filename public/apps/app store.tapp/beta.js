/**
 * Loads the repos content
 * @param {string} url 
 */
async function loadRepo(url) {
    const repo = await window.parent.tb.libcurl.fetch(url)
    const data = await repo.json()
    let type = "Terbium"
    if (data.name) {
        type = "Anura"
    }
    return {
        type,
        data
    }
}