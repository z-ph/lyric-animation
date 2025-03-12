/**
 * @description 解析歌词字符串为对象
 * @returns {time:开始时间,words:歌词内容} 歌词对象
 */
function parseLrc() {
    let lines = lrc.split("\n");
    let result = [];
    for (let i in lines) {
        let str = lines[i];
        let parts = str.split("]");
        let timeStr = parts[0].substring(1);
        let obj = {
            time: parseTime(timeStr),
            words: parts[1],
        };
        result.push(obj);
    }
    return result;
}
/**
 * 时间字符串转换为数字，以秒为单位
 * @param {string} timeStr
 * @returns {number} 时间
 */
function parseTime(timeStr) {
    let parts = timeStr.split(":");
    let minutes = parseInt(parts[0]);
    let seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
}
let doms = {
    audio: document.querySelector("audio"),
    ul: document.querySelector(".container ul"),
    container: document.querySelector(".container"),
};
let lrcObj_array = parseLrc();
console.log(lrcObj_array);
/**
 * @description 查找当前时间对应的歌词索引
 */
function findIndex() {
    let curTime = doms.audio.currentTime;
    for (let i in lrcObj_array) {
        if (curTime < lrcObj_array[i].time) {
            return i - 1;
        }
    }
    return lrcObj_array.length - 1;
}
//界面
function createLecElement() {
    let fragment = document.createDocumentFragment();
    for (let i in lrcObj_array) {
        let li = document.createElement("li");
        li.textContent = lrcObj_array[i].words;
        fragment.appendChild(li);
    }
    doms.ul.appendChild(fragment);
}
createLecElement();
//container高度
let containerHeight = doms.container.clientHeight;
//li高度
let li_height = doms.ul.children[0].clientHeight;
//最大偏移量
let maxOffset = doms.ul.clientHeight - containerHeight;
console.log(containerHeight, li_height, maxOffset);
function setOffset() {
    let index = findIndex();
    let offset = li_height * index + li_height / 2 - containerHeight / 2;
    if (offset < 0) {
        offset = 0;
    }
    // if (offset > maxOffset) {
    //     offset = maxOffset;
    // }
    let li = doms.ul.querySelector(".active");
    if (li) {
        li.classList.remove("active");
    }
    doms.ul.style.transform = `translateY(-${offset}px)`; //设置偏移量
    li = doms.ul.children[index];
    if (li) {
        li.classList.add("active");
    }
}
doms.audio.addEventListener("timeupdate", setOffset);
