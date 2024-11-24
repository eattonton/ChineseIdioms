//构造一个二维路径
class CPath2d{
    constructor(col, row){
        //行数
        this.RowNum = row;
        //列数
        this.ColNum = col;
        this.Num = row*col;
        //记录路径的序号
        this.Paths = [];
    }

    //创建正交路径，长度n
    CreateOrthPath(n){
        let times=0;
        let col0 = CArrayHelper.RandomInt(0, this.ColNum-1);
        let row0 = CArrayHelper.RandomInt(0, this.RowNum-1);
        //开始位置 在边水
        let pos0 = -1;
        let randEdge = CArrayHelper.RandomInt(0,3);
        if(randEdge == 0){
            pos0 = this.GetIndex(col0, 0);
        }else if(randEdge == 1){
            pos0 = this.GetIndex(col0, this.RowNum-1);
        }else if(randEdge == 2){
            pos0 = this.GetIndex(0, row0);
        }else if(randEdge == 3){
            pos0 = this.GetIndex(this.ColNum-1, row0);
        }
        this.Paths.push(pos0);
        let prevNexts = [];   //记录上一步的可能
        do{
            ++times;
            if(times >= 2000) break;
            let arrNext = this.GetNext(this.Paths[this.Paths.length-1]);
            if(arrNext.length == 0){
                //没有有效的下一步
                for(let j=prevNexts.length-1;j>=0;j--){
                    //上一步 有效的方向
                    if(prevNexts[j].length > 0){
                        this.Paths = this.Paths.slice(0, j+2);    //不含 j+2
                        this.Paths[this.Paths.length-1] = prevNexts[j][0];  //有效路被记录
                        prevNexts = prevNexts.slice(0,j+1);  //保留剩下的记录,不含 j+1
                        prevNexts[j] = prevNexts[j].slice(1);  //去掉被记录的
                        break;
                    }
                }
                continue;
            }
            //随机排序
            arrNext = CArrayHelper.GetRandQueue(arrNext, arrNext.length);
            this.Paths.push(arrNext[0]);
            //其它记录到上一步的可能步数
            if(arrNext.length > 1){
                prevNexts.push(arrNext.slice(1));
            }else{
                prevNexts.push([]);
            }
        }while(this.Paths.length < n);

        if(this.Paths.length == n){
            return true;
        }
        return false;
    }

    //获得下个位置
    GetNext(idx0){
        let indexs = [];
        let pos = this.GetColRowByIndex(idx0);
        let idxTmp = this.GetIndex(pos[0]-1, pos[1]);
        if(this.IsValidate(idxTmp)){
            indexs.push(idxTmp);
        }
        idxTmp = this.GetIndex(pos[0]+1, pos[1]);
        if(this.IsValidate(idxTmp)){
            indexs.push(idxTmp);
        }
        idxTmp = this.GetIndex(pos[0], pos[1]-1);
        if(this.IsValidate(idxTmp)){
            indexs.push(idxTmp);
        }
        idxTmp = this.GetIndex(pos[0], pos[1]+1);
        if(this.IsValidate(idxTmp)){
            indexs.push(idxTmp);
        }

        return indexs;
    }

    IsOnEdge(idx){
        let pos = this.GetColRowByIndex(idx);
        if(pos[0] == 0 || pos[0] == this.ColNum || pos[1] == 0 || pos[1] == this.RowNum){
            return true;
        }
        return false;
    }

    IsValidate(idx){
        if(idx < 0 || this.Paths.indexOf(idx) >= 0) {
            return false;
        }
        return true;
    }

    IsInside(){
        let col=-1,row=-1;
        if(arguments.length == 1){
            //输入的是序号
            [col, row] = this.GetColRowByIndex(arguments[0]);
        }else if(arguments.length == 2){
            col = arguments[0];
            row = arguments[1];
        }
        if(col >=0 && col < this.ColNum
            && row >=0 && row < this.RowNum){
            return true;
        }
        return false;
    }

    GetColRowByIndex(idx){
        return [idx % this.ColNum, parseInt(idx / this.ColNum)];
    }

    GetIndex(col,row){
        if(!this.IsInside(col,row)){
            return -1;
        }
        return row*this.ColNum + col;
    }
}