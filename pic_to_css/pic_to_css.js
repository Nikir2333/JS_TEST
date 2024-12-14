const fileDom = document.querySelector('input[type="file"]');
const btn = document.querySelector('button')

function loadImg(){
    const file = fileDom.files[0];
    if(!file){
        return null;
    }
    const objUrl = URL.createObjectURL(file);
    const img = new Image();
    return new Promise((resolve,reject)=>{
        img.onload = ()=>{
            resolve(img);
        }
        img.onerror = ()=>{
            reject(null);
        }
        img.src = objUrl;
    })
}

function createHTML(width,height,bmp){
    const shadowCSSFragments = [];
    const shadowCSSHover = [];
    for(let r = 0;r <height;r++){
        for(let c = 0;c < width;c++){
            const index = (r*width+c)*4;
            const R = bmp[index];
            const G = bmp[index+1];
            const B = bmp[index+2];
            const A = bmp[index+3]/255;
            shadowCSSFragments.push(`${c+1}px,${r}px,rgba(${R},${G},${B},${A})`);
            shadowCSSHover.push(`${c+1}px,${r}px,rgba(${255-R},${255-G},${225-B},${A})`);
        }    
    }
    return`
    <!DOCTYPE html>
    <html lang="en">
    <html>
      <head>
        <meta charset="UTF-8"> 
        <meta name="viewport" content="width-device-width,initial-scale=1.0"> 
        <title>HTML Style Example</title>
        <style>
           .shadow-img {
                width:${width}px;
                height:${height}px;
            }
           .shadow-img .inner {
                width:1px;
                height:1px;
                box-shadow:${shadowCSSFragments.join(',')};
                transition: 1.5s;
            }
            .shadow-img:hover .inner {
                box-shadow:${shadowCSSHover.join(',')}; 
            }
        </style>
      </head>
      <body>
        <div class='shadow-img'>
            <div class="inner"></div>
        </div>
      </body>
    </html>`;
}

function download(html){
    // 专门处理html方法的
    var blob =new Blob([html],{type:"text/html"});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.style.display='none';
    a.download ='shadow.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function generate(){
    const img = await loadImg();
    if(!img){
        return;
    }
    // html5的canvas 专门处理绘制和操作画布上的图形和图像的API接口
    const cvs = document.createElement('canvas');
    cvs.width = img.width; 
    cvs.height = img.height;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img,0,0);

    const bmp = ctx.getImageData(0,0,img.width,img.height).data;
    const html = createHTML(img.width,img.height,bmp);
    download(html);
}

btn.onclick = generate;