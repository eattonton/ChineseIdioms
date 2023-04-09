const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const boardWidth = canvas.width;
const boardHeight = canvas.height;

var size = 42;
var sizeBox = 2;  //宫size
var datas = {};
var hard = 8;   //困难模式
var m_category;
var m_numWord = 16;
var m_wordIndexs = [];
var m_drawBoard;
//////////////////////
//程序入口
////////////////////
function Start() {
}

function CreateA4(category) {
    m_category = category;
    m_drawBoard = new CDrawBoard(ctx);
    //清空屏幕
    m_drawBoard.ClearRect();

    //1.title
    if (m_category == 1) {
        m_drawBoard.WriteText("AABB,ABAB", 7.5, 2.0, 1.0);
    } else if (m_category == 2) {
        m_drawBoard.WriteText("小学成语", 7.5, 2.0, 1.0);
    } else if (m_category == 3) {
        m_drawBoard.WriteText("成语消消乐", 7.5, 2.0, 1.0);
    }
    //2.sub-title
    if (datas[m_category]) {
        CreateWordA4();
    }
    else {
        let urlData = "";
        if (m_category == 1) {
            urlData = "./data/aabb.json";
        } else if (m_category == 2) {
            urlData = "./data/idioms.json";
        } else if (m_category == 3) {
            urlData = "./data/xiaoxue.txt";
        }
        if (urlData) {
            LoadDictionary(urlData, (arr1) => {
                datas[m_category] = arr1;
                CreateWordA4();
            });
        }

    }
}

//生成 
function CreateWordA4() {
    var toastDlg = new Toast({
        text: "生成中"
    });
    toastDlg.Show();

    //二维码
    let loadImg0 = function () {
        m_drawBoard.DrawImage('./qr.png', () => {
            toastDlg.Close();
            ShowImageDlg();
        }, [50, 50, 180, 180]);
    }

    if (m_category <= 2) {
        m_drawBoard.WriteTextsH(["班级________", "姓名________", "用时________", "得分________"], 2.5, 4.5, 0.5);
        DrawWordsByRow(datas[m_category]);
    } else if (m_category == 3) {
        m_BlockCellWidth = 1.4;
        CreateOneBox(4.5, 4);
        CreateOneBox(4.5, 17.5);
    }
    loadImg0();
}

//按行添加成语
function DrawWordsByRow(arr1) {
    let idxs = CArrayHelper.GetRandQueueInRange(size, 0, arr1.length - 1);
    let arr2 = new Array();
    let rowY = null;
    for (let i = 0; i < idxs.length; i++) {
        arr2.push(MergeBlank(AddBrackets(arr1[idxs[i]]["t"]), 12));
        if (i % 3 == 2) {
            rowY = DrawRow(arr2, rowY);
            arr2 = new Array();
        }
    }
}

function DrawRow(arr2, startY) {
    startY = startY || 5.0;
    let rowY = startY;
    rowY = startY + 1.5;
    m_drawBoard.WriteTextsH(arr2, 1.5, rowY, 0.65);

    return rowY;
}

//替换成括号
function AddBrackets(str1) {
    let str2 = "";
    let iMod = CArrayHelper.RandomInt(0, 1);
    for (let i = 0, len = str1.length; i < len; i++) {
        if (str1.length == 3) {
            if (i == 0) {
                str2 += str1.charAt(i);
            } else {
                str2 += "(   )";
            }
        } else if (iMod == 0) {
            if (i == 0 || i == 2) {
                str2 += str1.charAt(i);
            } else {
                str2 += "(   )";
            }
        } else if (iMod == 1) {
            if (i == 1 || i == 3) {
                str2 += str1.charAt(i);
            } else {
                str2 += "(   )";
            }
        }

    }

    return str2;
}

//成语消消乐
function CreateOneBox(x, y) {
    //1.生成棋盘
    let chess1 = new chessBoard();
    chess1.CreateChessData();
    //2.随机获得一组成语
    m_wordIndexs = CArrayHelper.GetRandQueueInRange(m_numWord, 0, datas[m_category].length - 1);
    //3.绘制表格
    DrawBlocks(x, y, chess1);
}

//绘制方格
function DrawBlocks(x0, y0, chess1) {
    let x1 = x0;
    let y1 = y0;
    //记录文字的绘制顺序
    let wordSeq = {};
    for (let y = 0; y < chess1.numRow; y++) {
        for (let x = 0; x < chess1.numCol; x++) {
            //1.绘制方格
            m_drawBoard.DrawSquare(x1, y1,m_BlockCellWidth);
            let str1 = "";
            //2.获得成语的序号
            let idx1 = chess1.boxs[y][x].id;
            let idx2 = m_wordIndexs[idx1];
            //3.获得四字成语
            str1 = datas[m_category][idx2];
            //4.获得成语的某个字
            let idx3 = chess1.boxs[y][x].id2;
            //5.随机绘制顺序
            if (wordSeq[idx1] == undefined) {
                wordSeq[idx1] = CArrayHelper.RandomInt(0, 1);
            }
            if (wordSeq[idx1] == 1) {
                //翻转一下顺序
                idx3 = 3 - idx3;
            }
            //6.提取成语的单个词
            str1 = str1[idx3];
            //7.绘制文字
            m_drawBoard.WriteText(str1, x1 + 0.2 * m_BlockCellWidth, y1 + 0.7 * m_BlockCellWidth, 0.7);
            x1 = x1 + m_BlockCellWidth;
        }
        y1 = y1 + m_BlockCellWidth;
        x1 = x0;
    }
}
 
//加载字典
function LoadDictionary(url, cb) {
    if (url.endsWith(".txt")) {
        $.get(url, (e) => {
            if (e) {
                cb(e.split(';'));
            }
        })
    } else {
        $.getJSON(url, (e) => {
            if (e) {
                cb(e);
            }
        })
    }

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
 