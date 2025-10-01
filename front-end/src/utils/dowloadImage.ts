export function downloadImage(link: string) {
    const element = document.createElement("a");
    element.href = link;
    element.click();
}