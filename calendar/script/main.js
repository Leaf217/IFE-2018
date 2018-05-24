let con = document.getElementById('container')

// 选择单个日期使用举例
new Calendar(con, new Date(), '2018-5-22', '2018-9-30').init();
// new Calendar(con, '2016-03-17', '2018-5-22', '2018-9-30').init();

// 选择时间段使用举例
// new Calendar(con, '2018-6-30', '2018-5-22', '2018-9-30', true, 2, 8).init();