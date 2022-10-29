const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const boardWidth = canvas.width;
const boardHeight = canvas.height;

var size = 42;
var sizeBox = 2;  //宫size
var datas = {};
var hard= 8;   //困难模式
//////////////////////
//程序入口
////////////////////
function Start() {
}

function CreateWordA4(category){
    var toastDlg = new Toast({
        text:"生成中"
    });
    toastDlg.Show();
    //ctx.clearRect(0,0,boardWidth,boardHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,boardWidth,boardHeight);
    
    //二维码
    let funEndAndShow =()=>{
        DrawImage('./qr.png',()=>{
            toastDlg.Close();
            ShowImageDlg();
        });
    } 
    //1.title
    if(category == 1){ 
        WriteText("AABB,ABAB", 7.5, 2.0, 1.0);
    }else if(category == 2){
        WriteText("小学成语", 7.5, 2.0, 1.0);
    }
    //2.sub-title
    WriteTextsH(["班级________", "姓名________", "用时________", "得分________"], 2.5, 3.5, 0.5);
    if(datas[category]){
        DrawWordsByRow(datas[category]);
        funEndAndShow();
    }
    else{
        let urlData = "";
        if(category == 1){
            urlData = "./data/aabb.json";
        }else if(category == 2){
            urlData = "./data/idioms.json";
        } 
        if(urlData){
            LoadDictionary(urlData, (arr1)=>{
                datas[category] = arr1;
                DrawWordsByRow(arr1);
                funEndAndShow();
            });
        }
        
    }
 
    
}

function DrawWordsByRow(arr1){
    let idxs = GetRandQueueInRange(size, 0, arr1.length-1);
    let arr2 = new Array();
    let rowY = null;
    for(let i=0; i<idxs.length; i++){
        arr2.push(MergeBlank(AddBrackets(arr1[idxs[i]]["t"]), 12));
        if(i % 3 == 2){
            rowY = DrawRow(arr2, rowY);
            arr2 = new Array();
        }
    }
}

function DrawRow(arr2, startY){
    startY = startY || 4.0;

    let rowY = startY;
    rowY = startY + 1.5;
    WriteTextsH(arr2, 1.5, rowY, 0.65);

    return rowY;
}

//替换成括号
function AddBrackets(str1){
    let str2 = "";
    let iMod = RandomInt(0, 1);
    for (let i = 0, len = str1.length; i < len; i++) {
        if(str1.length == 3){
            if(i == 0){
                str2 += str1.charAt(i);
            }else{
                str2 += "(   )";
            }
        }else if(iMod == 0){
            if(i == 0 || i == 2){
                str2 += str1.charAt(i);
            }else{
                str2 += "(   )";
            }
        }else if(iMod == 1){
            if(i == 1 || i == 3){
                str2 += str1.charAt(i);
            }else{
                str2 += "(   )";
            }
        }
        
    }

    return str2;
}

//加载字典
function LoadDictionary(url,cb){
    $.getJSON(url, (e)=>{
        if(e){
            cb(e);
        }
    })
}

//在范围内，生成一定数量不重复的随机数
function GetRandQueueInRange(n, min, max){
    // let arr = [];
    // // 在此处补全代码
    // for(let i=0; i < n; i++){
    //     let number= RandomInt(min, max);
    //     if(arr.indexOf(number) == -1){ //去除重复项
    //         arr.push(number);
    //     }else{
    //         i--;
    //     }   
    // }
    // return arr;
    return Array.from({length:n}, v=> RandomInt(min, max));
     
}

//生成随机队列
function GetRandQueue(array){
    if(!array){
        array = new Array();
        for (let i=0; i<size; i++) {
            array[i] = i;
        }
    }
    let res = [], random;
    while(array.length>0){
        random = Math.floor(Math.random()*array.length);
        res.push(array[random]);
        array.splice(random, 1);
    }
    return res;
}

//随机生成 同一个宫内的值
function GetRandPosition(n) {
    if (n == undefined || n == null || n == -1) {
        return RandomInt(0, size - 1);
    } else {
        //生成的随机数 不能与 n相同，而且必须在同一个宫中
        let boxn = parseInt(n / sizeBox);
        for (let i = 0; i < 1000; i++) {
            let n2 = RandomInt(0, size - 1);
            let boxn2 = parseInt(n2 / sizeBox);
            if (n2 != n && boxn == boxn2) {
                return n2;
            }
        }
    }

    return -1;
}


//成行显示
function WriteTextsH(arr1, x, y, hei, scale) {
    let tbWid = 0;
    let x2 = x;
    for (let i = 0; i < arr1.length; ++i) {
        x2 = x2 + tbWid;
        WriteText(arr1[i], x2, y, hei, scale);
        //计算宽度
        tbWid = arr1[i].length * hei * 0.8;
    }
}

//绘制题目
function WriteText(str1, x, y, hei, scale) {
    scale = scale || 60;
    let fontHei = hei * scale + "px";
    ctx.font = "normal " + fontHei + " 宋体";
    ctx.fillStyle = "#000000";
    ctx.fillText(str1, x * scale, y * scale);
}

function DrawLine(x1, y1, x2, y2, wid, scale) {
    scale = scale || 60;
    wid = wid || 0.1;
    ctx.lineWidth = wid * scale;
    ctx.strokeStyle = "black";
    //开始一个新的绘制路径
    ctx.beginPath();
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    ctx.stroke();
    //关闭当前的绘制路径
    ctx.closePath();
}

//把输入和空白的进行组合
function MergeBlank(inputStr, strLen) {
    strLen = strLen || inputStr.length;
 
    let str2 = "";
    for (let i = 0, len = strLen; i < len; i++) {
        if (i < inputStr.length) {
            str2 = str2 + inputStr.charAt(i);
        } else {
            str2 = str2 + " ";
        }
    }

    return str2;
}

//生成随机值
function RandomInt(min, max) {
    var span = max - min + 1;
    var result = Math.floor(Math.random() * span + min);
    return result;
}

//显示生成的题目图片，长按保存
function ShowImageDlg() {
    let strImg = "<img ";
    strImg += "src=" + canvas.toDataURL('png', 1.0);
    strImg += " style='width:350px;height:500px;'></img>";
    let dlg1 = new Dialog({
        title: "长按图片，保存下载",
        text: strImg
    });

    dlg1.Show();
}

//下载
function DownLoad() {
    //确定图片的类型  获取到的图片格式 data:image/Png;base64,......
    let type = 'jpeg';
    let imgdata = canvas.toDataURL(type, 1.0);
    //将mime-type改为image/octet-stream,强制让浏览器下载
    let fixtype = function (type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        let r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    };
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream');
    //将图片保存到本地
    let savaFile = function (data, filename) {
        let save_link = document.createElement('a');
        save_link.href = data;
        save_link.download = filename;
        let event = new MouseEvent('click');
        save_link.dispatchEvent(event);
    };

    let filename = '' + new Date().format('yyyy-MM-dd_hhmmss') + '.' + type;
    //用当前秒解决重名问题
    savaFile(imgdata, filename);
}

Date.prototype.format = function (format) {
    let o = {
        "y": "" + this.getFullYear(),
        "M": "" + (this.getMonth() + 1),  //month
        "d": "" + this.getDate(),         //day
        "h": "" + this.getHours(),        //hour
        "m": "" + this.getMinutes(),      //minute
        "s": "" + this.getSeconds(),      //second
        "S": "" + this.getMilliseconds(), //millisecond
    }
    return Object.keys(o).reduce((pre, k) => (new RegExp("(" + k + "+)").test(pre)) ? (pre.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : o[k].padStart(2, "0"))) : pre, format);
}

//绘制图片
function DrawImage(img0, cb) {
    let imgObj = new Image();
    imgObj.src = img0;
    imgObj.onload = function () {
        ctx.drawImage(imgObj, 25, 25, 150, 150);
        if (typeof cb == "function") {
            cb();
        }
    }
}