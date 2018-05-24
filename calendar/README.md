### 思路：

- 布局
    - 输入框（默认显示当前日期）
    - 左右按钮及显示日期（默认display：none）
    - 日期详情：星期、日期（默认display：none）
- 绑定事件
    - 输入框
        - 输入后点击回车（keydown）：判断格式是否正确，若正确，显示相应日期框，不正确，提示错误。其中正确需要满足格式正确以及在给定的日期范围内（lowerLimit, upperLimit）
        - 点击输入框（click）：显示对应的日期框，再点击隐藏
    - 左右键（click）：左减月份，右加月份，输入框中的日期及日期框更新
    - 日期框（click）：点击日期框中的日期，input中同步更新，被点击的日期置红色背景，日期框隐藏
- 初始化
    - 设定默认时间
    - 设定默认日期范围
    - 渲染布局
    - 绑定事件

- 使用类实现
    ```
    class Calendar {
        constructor() {
            this... = ...
        }
        render() {
            
        }
        ...
    }
    ```