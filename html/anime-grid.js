const canvas = document.querySelector('canvas');
canvas.style.imageRendering = 'pixelated';
const ctx = canvas.getContext('2d');

const bodyMargin = 20;
const contentWidth = 600;
const contentHeight = 560;

const typeTexts = `入坑作
最喜欢
看最多次
最想安利

最佳剧情
最佳画面
最佳配乐
最佳配音

最治愈
最感动
最虐心
最被低估

最过誉
最离谱
最讨厌`;

const types = typeTexts.trim().split(/\n+/g);

const col = 5;
const row = 3;

const colWidth = contentWidth / col;
const rowHeight = contentHeight / row;
const titleHeight = 40;
const fontHeight = 24;




const width = contentWidth + bodyMargin * 2;
const height = contentHeight + bodyMargin * 2 + titleHeight;
const scale = 2;
canvas.width = width * scale;
canvas.height = height * scale;
ctx.scale(scale,scale);
ctx.translate(
    bodyMargin,
    bodyMargin + titleHeight
);



ctx.font = '18px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = '#222';
ctx.lineCap  = 'round';
ctx.lineJoin = 'round';

ctx.save();
ctx.lineWidth = 2;
ctx.strokeStyle = '#222';


for(let y = 0;y <= row;y++){

    ctx.beginPath();
    ctx.moveTo(0,y * rowHeight);
    ctx.lineTo(contentWidth,y * rowHeight);
    ctx.globalAlpha = 1;
    ctx.stroke();

    if( y === row) break;
    ctx.beginPath();
    ctx.moveTo(0,y * rowHeight + rowHeight - fontHeight);
    ctx.lineTo(contentWidth,y * rowHeight + rowHeight - fontHeight);
    ctx.globalAlpha = .2;
    ctx.stroke();
}
ctx.globalAlpha = 1;
for(let x = 0;x <= col;x++){
    ctx.beginPath();
    ctx.moveTo(x * colWidth,0);
    ctx.lineTo(x * colWidth,contentHeight);
    ctx.stroke();
}
ctx.restore();

for(let y = 0;y < row;y++){

    for(let x = 0;x < col;x++){
        const top = y * rowHeight;
        const left = x * colWidth;
        const type = types[y * col + x];
        ctx.fillText(
            type,
            left + colWidth / 2,
            top + rowHeight - fontHeight / 2,
        );
    }
}
let currentBangumiId = null;
const bangumis = new Array(types.length);
const Images = {};

const loadImage = (src,onOver)=>{
    if(Images[src]) return onOver(Images[src]);
    const el = new Image();
    el.crossOrigin = 'Anonymous';
    el.src = src;
    el.onload = ()=>{
        onOver(el)
        Images[src] = el;
    }
    document.body.appendChild(el);
};

bangumis[0] = 9717;


const imageWidth = colWidth - 2;
const imageHeight = rowHeight - fontHeight;
const canvasRatio = imageWidth / imageHeight;

const drawBangumis = ()=>{
    for(let index in bangumis){
        const id = bangumis[index];
        const x = index % row;
        const y = Math.floor(index / row);

        loadImage(`https://nagisa.magiconch.com/api/bangumi/anime/${id}/cover.jpg`,el=>{
            const { naturalWidth, naturalHeight } = el;
            const originRatio = el.naturalWidth / el.naturalHeight;
            // let dx, dy, dw, dh;
            // if(originRatio < canvasRatio){
            //     dh = imageHeight
            //     dw = dh * originRatio
            //     dx = (imageWidth - dw) / 2
            //     dy = 0
            // }else{
            //     dw = imageWidth
            //     dh = dw / originRatio
            //     dx = 0
            //     dy = (imageHeight - dh) / 2 
            // }

            // ctx.drawImage(
            //     el,
            //     x * colWidth + 1 + dx,
            //     y * rowHeight + 1 + dy,
            //     dw,
            //     dh,
            // );
            let sw, sh, sx, sy;
            if(originRatio < canvasRatio){
                sw = naturalWidth
                sh = naturalWidth / imageWidth * imageHeight;
                sx = 0
                sy = (naturalHeight - sh)
            }else{
                sh = naturalHeight
                sw = naturalHeight / imageHeight * imageWidth;
                sx = (naturalWidth - sw)
                sy = 0
            }

            ctx.drawImage(
                el,
                
                sx, 
                sy, 

                sw, 
                sh, 

                x * colWidth + 1,
                y * rowHeight + 1, 
                imageWidth,
                imageHeight,
            );
        })
    }
}

drawBangumis();

const downloadBtnEl = document.querySelector('.generator-btn');

const downloadImage = ()=>{
    const fileName = '[神奇海螺][动画生涯个人喜好表].jpg';
    const mime = 'image/jpg';
    const imgURL = canvas.toDataURL(mime,0.8);
    const linkEl = document.createElement('a');
    linkEl.download = fileName;
    linkEl.href = imgURL;
    linkEl.dataset.downloadurl = [ mime, fileName, imgURL ].join(':');
    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
}

downloadBtnEl.onclick = downloadImage;


canvas.onclick = e=>{
    const rect = canvas.getBoundingClientRect();
    const { clientX, clientY } = e;
    console.log(e,rect, clientX, clientY);
    console.log(clientX)
    console.log(clientX - rect.left)
    const x = Math.ceil(((clientX - rect.left) / rect.width * width - bodyMargin) / colWidth);
    const y = Math.ceil(((clientY - rect.top) / rect.height * height  - bodyMargin - titleHeight) / rowHeight);
    console.log(x,y);
}