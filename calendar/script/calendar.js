// 使用：new Calendar(container, initialDate, lowerLimit, upperLimit)
// 参数除container之外都可以省略
class Calendar {
    constructor(container, initialDate, lowerLimit, upperLimit, multiDate, minRange, maxRange) {
        this.nowDate = new Date(initialDate) || new Date(); // 此时的日期
        this.container = container; // 容器
        this.lowerLimit = lowerLimit; // 允许输入的最小日期
        this.upperLimit = upperLimit; // 允许输入的最大日期
        this.show = false; // 日期框的显示与隐藏
        this.multiDate = multiDate; // 选择一个日期或者一个时间段,true为时间段
        this.dateRange = []; // 用于存放两次连续点击的date
        this.minRange = minRange; // 选择时间段时的最少天数
        this.maxRange = maxRange; // 选择时间段时的最多天数

    }
    
    // 初始化页面
    init() {
        let containerDom = this.container;

        // 1. input框
        let inputWrapper = document.createElement('div');
        inputWrapper.id = 'input-wrapper';
        inputWrapper.innerHTML = `
            <img src="images/calendar-img.png" alt="日历图标" id="calendar-img">
            <input type="text" id="date-input">`.trim();
        containerDom.appendChild(inputWrapper);


        // 2. 日历框
        let dateWrapper = document.createElement('div');
        dateWrapper.id = 'date-wrapper';

        // 1) 日历框表头（title的render放在日期渲染中）
        let dateTools = document.createElement('div');
        dateTools.id = 'date-tools';
        dateTools.innerHTML = `
            <img src="images/last.png" alt="上个月" id="last">
            <span id="title"></span>
            <img src="images/next.png" alt="下个月" id="next">`.trim();
        dateWrapper.appendChild(dateTools);
        
        // 2) 日历框内容
        // let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        let days = ['日', '一', '二', '三', '四', '五', '六'];
        let dateDetails = document.createElement('table');
        dateDetails.id = 'date-details';
        dateDetails.innerHTML = `
            <thead id="date-head"></thead>
            <tbody id="date-body"></tbody>`.trim();

        // a. 日历框内容：表头-星期
        let headCon = document.createElement('tr');
        let headDetails = '';
        for (let i = 0;i < 7;i++) {
            if (i === 0 || i === 6) {
                headDetails += `<td class="weekend">${days[i]}</td>`;
            } else {
                headDetails += `<td>${days[i]}</td>`;
            }
        }
        headCon.innerHTML = headDetails;
        dateWrapper.appendChild(dateDetails);
        containerDom.appendChild(dateWrapper);
        document.getElementById('date-head').appendChild(headCon);

        // b. 日历框内容：表内容-日期(初始化时显示当前日期)
        this.renderDate(this.nowDate);

        // 时间段确认弹框
        let confirm = document.createElement('div');
        confirm.id = 'confirm';
        confirm.innerHTML = `<button>确认</button><button>取消</button>`;
        dateWrapper.appendChild(confirm);

        this.addEvent();
    }

    // 渲染表内容-日期：传入Date对象
    renderDate(initialDate, dateRange) {
        let dateCopy = new Date(initialDate); // 不能直接赋值，否则两者将指向同一地址

        // 将日历框中的日期同步到input中
        document.getElementById('date-input').value = `
        ${dateCopy.getFullYear()}-${dateCopy.getMonth() + 1}-${dateCopy.getDate()}`.trim();

        // 上个月和下个月按钮中间显示的年月
        let title = document.getElementById('title');
        title.innerHTML = `${dateCopy.getFullYear()}年${dateCopy.getMonth() + 1}月`;

        // 找到要渲染的第一天的日期：有可能是上个月
        let firstDay = this.getFirstDay(dateCopy);
        dateCopy.setDate(1 - firstDay); // 当setData传入的参数为0时，读取的是上个月的最后一天，以此类推
        
        let dateBody = document.getElementById('date-body');
        dateBody.innerHTML = '';

        //42个格
        for (let i = 0;i < 6;i++) {
            let tr = document.createElement('tr');
            for (let j = 0;j <7;j++) {
                let td = document.createElement('td');
                td.innerHTML = `${dateCopy.getDate()}`;
                
                if (dateCopy.getMonth() !== initialDate.getMonth()) {
                    td.className = "illegalDay";
                } 
                else if (dateCopy.getDay() === 0 || dateCopy.getDay() === 6) {
                    td.className = "weekend";
                }
                if (dateCopy.getDate() === initialDate.getDate() && dateCopy.getMonth() === initialDate.getMonth()) {
                    td.className = "selected-date";
                }
                tr.appendChild(td);
                dateCopy.setDate(dateCopy.getDate() + 1);
            }
            dateBody.appendChild(tr);
        }

        // 选择时间段的情况
        if (this.dateRange.length === 2) {
            let nowRange = Math.abs(this.dateRange[0].getDate() - this.dateRange[1].getDate() + 1);
            if (this.minRange && this.maxRange && nowRange >= this.minRange && nowRange <= this.maxRange) {
                let allTd = document.querySelectorAll('td');
                let firstIndex, secondIndex;
                for (let i = 0;i < allTd.length;i++) {
                    if (allTd[i].className !== 'illegalDay') {
                        if (allTd[i].innerText === this.dateRange[0].getDate().toString()) {
                            allTd[i].className = 'selected-date';
                            firstIndex = i;
                        }
                        if (allTd[i].innerText === this.dateRange[1].getDate().toString()) {
                            allTd[i].className = 'selected-date';
                            secondIndex = i;
                        }
                    }
                }
                // 判断两次点击日期的先后
                if (firstIndex > secondIndex) {
                    let mid = firstIndex;
                    firstIndex = secondIndex;
                    secondIndex = mid;
                }
                if (firstIndex !== secondIndex) {
                    for (let i = firstIndex + 1;i < secondIndex;i++) {
                        allTd[i].className = 'date-range';
                    }
                }
            } else {
                this.notInRange();
            }
        }
    }

    //计算某月的1号是周几 返回值为数字:0-6对应Sun-Sat
    getFirstDay (date) {
        date.setDate(1);
        return date.getDay();
    }


    addEvent() {
        // next键
        document.getElementById('next').addEventListener('click', () => {
            let dateNext = new Date(this.nowDate);
            dateNext.setMonth(dateNext.getMonth() + 1);
            this.renderDate(dateNext);
            this.nowDate = dateNext;
        });

        // last键
        document.getElementById('last').addEventListener('click', () => {
            let dateNext = new Date(this.nowDate);
            dateNext.setMonth(dateNext.getMonth() - 1);
            this.renderDate(dateNext);
            this.nowDate = dateNext;
        });

        // 日历框的显示与隐藏
        document.getElementById('input-wrapper').addEventListener('click', (e) => {
            if (e.target.id === 'date-input' || e.target.id === 'calendar-img') {
                this.show = !this.show;
            }
            document.getElementById('date-wrapper').style.display = this.show ? 'block' : 'none';
        })

        // 日期的选择
        document.getElementById('date-body').addEventListener('click', (e) => {            
            if (e.target.className !== 'illegalDay') {
                this.nowDate.setDate(parseInt(e.target.innerText));

                // 这儿可以返回一个被点击的对象 return this.nowDate
                this.renderDate(this.nowDate);

                // 点击后的回调函数 
                this.clickDate();
            }
            
        })

        // 日期的输入
        document.getElementById('date-input').addEventListener('keydown', (e) => {
            if ((e.which || e.keyCode) === 13) {
                let inputValue = document.getElementById('date-input').value;
                if (this.checkInput(inputValue) && this.checkScope(inputValue, this.lowerLimit, this.upperLimit)) {
                    this.nowDate = new Date(inputValue.toString());
                    this.renderDate(this.nowDate);
                } else {
                    alert(`${this.checkInput(inputValue) ? '输入的日期不在指定范围内' : '您输入的日期有误，请按照格式YYYY-MM-DD输入'}`);
                }
            }
        })

    }

    // 日期格式检查
    checkInput(inputDate) {
        return /^\d\d\d\d-\d\d-\d\d$/.test(inputDate);
    }

    // 日期范围检查：上下限可都不做输入，也可只输入一个限制
    checkScope(inputDate, lower, upper) {
        let newDate = new Date(inputDate);
        let lowerDate = new Date(lower);
        let upperDate = new Date(upper);
        if ((lower && upper && newDate > lowerDate && newDate < upperDate) || (!upper && lower && newDate > lowerDate) || (!lower && upper && newDate < upperDate) || (!lower && !upper)) {
            return true;
        } else {
            return false;
        }
    }

    // 点击日期时的回调函数
    clickDate () {
        if (this.multiDate) {
            if (this.dateRange.length === 0) {
                this.dateRange.push(new Date(this.nowDate));
                return;
            }
            if (this.dateRange.length === 1) {
                this.dateRange.push(new Date(this.nowDate));
                this.renderDate(this.nowDate);
                this.dateRange = [];
                return;
            }
        }
        
    }

    // 选择时间段时，不符合最小以及最大时间段要求时的提醒
    notInRange() {
        alert('选择的日期范围不符合设定范围哦～');
    }
}