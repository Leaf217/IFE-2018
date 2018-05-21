let emailInput = document.getElementById('email-input');
let emailProWrapper = document.getElementById('email-pro-wrapper')
let postfixList = ['163.com', 'gmail.com', '126.com', 'qq.com', '263.net'];
let selectedIndex = 0;//默认选中第一个提示的邮箱地址


//input框的输入
emailInput.addEventListener('input', inputListen);
function inputListen(e) {
    if(((e.which || e.keyCode) !== 13) && ((e.which || e.keyCode) !== 38) && ((e.which || e.keyCode) !== 40)) {
        resetSelectStatus();
    }
    addToList();
    switchStatus(); 
}

//监听上下键以及回车键
emailInput.addEventListener('keydown', keyDown);
function keyDown (e) {
    let listItems = emailProWrapper.getElementsByTagName('li');

    switch(e.which || e.keyCode) {
        //上键
        case 38: {
            e.preventDefault();
            listItems[selectedIndex].className = '';//清除原有样式
            selectedIndex = selectedIndex === 0 ? listItems.length - 1 : selectedIndex - 1;
            listItems[selectedIndex].className = 'selected';
            break;
        }
        //下键
        case 40: {
            e.preventDefault();
            listItems[selectedIndex].className = '';
            selectedIndex = selectedIndex >= listItems.length - 1 ? 0 : selectedIndex + 1;
            listItems[selectedIndex].className = 'selected';
            break;
        }
        //Enter键
        case 13: {
            emailInput.value = HtmlUtil.htmlDecode(listItems[selectedIndex].innerText);
            hidePrompt();
            break;
        }
        //Esc键
        case 27: {
            emailInput.select();
            break;
        }
    }
}


//点击选择邮箱地址
emailProWrapper.addEventListener('click', selectEmail);
function selectEmail (e) {
    if (e.target.tagName.toLowerCase() === 'li') {
        emailInput.value = HtmlUtil.htmlDecode(e.target.innerText);
        hidePrompt();
        emailInput.focus();
    }
}

//点击空白处，隐藏提示
document.addEventListener('click', function (e) {
    if (e.target.className !== 'wrapper') {
        hidePrompt();
    }
})

//获取用户输入
function getInput () {
    return emailInput.value.trim();
}

//生成提示
function generatePrompt () {
    let emailList = [];
    let defaultEmailList = [];
    let inputValue = HtmlUtil.htmlEncode(getInput());
    let userName, postfix;
    if (inputValue.indexOf('@') !== -1){
        userName = inputValue.split('@')[0];
        postfix = inputValue.split('@')[1];
    }
    if (inputValue) {
        for (let i = 0;i < postfixList.length;i++) {
            if (postfix) {
                if (postfixList[i].indexOf(postfix) !== -1) {
                    emailList.push(userName + '@' + postfixList[i]);
                }
            } else {
                emailList.push((userName || inputValue) + '@' + postfixList[i]);
            }
            defaultEmailList.push((userName || inputValue) + '@' + postfixList[i]);
        }
    }
    return emailList.length > 0 ? emailList : defaultEmailList;
}

//将提示添加到ul中
function addToList () {
    let list = generatePrompt();
    if (list.length > 0) {
        emailProWrapper.innerHTML = '';
        for (let i = 0;i < list.length;i++) {
            let child = document.createElement('li');
            child.innerHTML = `${list[i]}`;
            emailProWrapper.appendChild(child);
        }
        emailProWrapper.getElementsByTagName('li')[selectedIndex].className = 'selected';
    }
}

//重置选中状态
function resetSelectStatus () {
    selectedIndex = 0;
}

//切换提示的隐藏/显示状态
function switchStatus () {
    !getInput() ? hidePrompt() : showPrompt();
}

//隐藏提示
function hidePrompt () {
    emailProWrapper.style.display = 'none';
}

//显示提示
function showPrompt () {
    emailProWrapper.style.display = 'block';
}