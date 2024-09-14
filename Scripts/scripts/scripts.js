//$(function () {
//    var employeeHub = $.connection.employeeHub;
//    var alertQueue = $('#alertContainer');
//    var alertTimeout = 10000; // 10 seconds
//    var currentData = []; // Array to store current data

//    function isDataDifferent(newData) {
//        if (currentData.length !== newData.length) {
//            return true;
//        }

//        for (var i = 0; i < newData.length; i++) {
//            var found = false;
//            for (var j = 0; j < currentData.length; j++) {
//                if (newData[i].MaThe === currentData[j].MaThe &&
//                    newData[i].HoTen === currentData[j].HoTen &&
//                    newData[i].TenBoPhan === currentData[j].TenBoPhan &&
//                    newData[i].ErrorCode === currentData[j].ErrorCode &&
//                    moment(newData[i].ThoiGian).isSame(moment(currentData[j].ThoiGian))) {
//                    found = true;
//                    break;
//                }
//            }
//            if (!found) {
//                return true;
//            }
//        }

//        return false;
//    }

//    employeeHub.client.updateEmployeeData = function (employeeData) {
//        console.log('Received data:', employeeData);

//        // Check if the data is different from the current data
//        if (isDataDifferent(employeeData)) {
//            // Show data in alert queue
//            alertQueue.empty(); // Clear existing alerts
//            $.each(employeeData, function (index, employee) {
//                var errorCode = employee.ErrorCode.toLowerCase();
//                var alertClass = errorCode === 'pass' ? 'pass' : 'fail';

//                //var alertItem = $('<div class="alert-item ' + alertClass + '"><table><thead><tr><th>Mã thẻ<br />卡码</th><th>Họ tên<br />姓名</th><th>Bộ phận<br />部分</th><th>Trạng thái<br />地位</th><th>Thời gian<br />时间</th></tr></thead><tbody><tr><td>' + employee.MaThe + '</td><td>' + employee.HoTen + '</td><td>' + employee.TenBoPhan + '</td><td>' + employee.ErrorCode + '</td><td>' + moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss') + '</td></tr></tbody></table></div>');
//                var alertItem = $('<div class="alert-item"><table><thead><tr><th>Mã thẻ<br />卡码</th><th>Họ tên<br />姓名</th><th>Bộ phận<br />部分</th><th>Trạng thái<br />地位</th><th>Thời gian<br />时间</th></tr></thead><tbody><tr class="' + alertClass + '"><td>' + employee.MaThe + '</td><td>' + employee.HoTen + '</td><td>' + employee.TenBoPhan + '</td><td>' + employee.ErrorCode + '</td><td>' + moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss') + '</td></tr></tbody></table></div>');

//                alertQueue.append(alertItem);
//                alertItem.fadeIn(); // Show the alert item

//                // Automatically remove alert item after a certain time
//                setTimeout(function () {
//                    alertItem.fadeOut(function () {
//                        alertItem.remove();
//                    });
//                }, alertTimeout);
//            });

//            // Update current data
//            currentData = employeeData;
//        }
//    };

//    $.connection.hub.start().done(function () {
//        console.log('SignalR connected.');

//        // Refresh data every 10 seconds
//        setInterval(function () {
//            employeeHub.server.getEmployeeData(); // Call server method to get new data
//        }, 10000); // 10000ms = 10 seconds
//    });

//});

// Đã ok alter 
//$(function () {
//    var employeeHub = $.connection.employeeHub;
//    var alertQueue = $('#alertContainer'); // Phần tử chứa thông báo
//    var currentData = {}; // Đối tượng lưu trữ trạng thái thông báo hiện tại, dùng mã thẻ làm khóa

//    // Hàm cập nhật kích thước của thông báo dựa trên số lượng và kích thước màn hình
//    function adjustAlertSize() {
//        var numAlerts = alertQueue.children('.alert-item').length;
//        var containerHeight = alertQueue.height();
//        var alertHeight = alertQueue.children('.alert-item').outerHeight(true); // Bao gồm padding và margin

//        if (numAlerts * alertHeight > containerHeight) {
//            // Nếu tổng chiều cao của tất cả thông báo lớn hơn chiều cao của khung chứa
//            alertQueue.children('.alert-item').addClass('small').removeClass('large');
//        } else {
//            // Nếu tổng chiều cao của tất cả thông báo nhỏ hơn hoặc bằng chiều cao của khung chứa
//            alertQueue.children('.alert-item').addClass('large').removeClass('small');
//        }
//    }
//     //Hàm cập nhật thông báo dựa trên dữ liệu mới
//    //function updateAlerts(employeeData) {
//    //    var seenEmployees = new Set(); // Set để theo dõi các mã thẻ đã thấy
//    //    var alertItems = alertQueue.children('.alert-item'); // Lấy tất cả các phần tử thông báo hiện tại

//    //    // Lặp qua dữ liệu mới để cập nhật thông báo
//    //    $.each(employeeData, function (index, employee) {
//    //        var errorCode = employee.ErrorCode.toLowerCase(); // Chuyển mã lỗi thành chữ thường

//    //        // Nếu trạng thái là pass, xóa thông báo lỗi liên quan
//    //        if (errorCode === 'pass') {
//    //            // Xóa tất cả thông báo lỗi liên quan đến người dùng có mã thẻ này
//    //            var alertItem = currentData[employee.MaThe];
//    //            if (alertItem) {
//    //                alertItem.fadeOut(function () {
//    //                    alertItem.remove(); // Xóa phần tử thông báo sau khi ẩn
//    //                    adjustAlertSize(); // Điều chỉnh kích thước sau khi xóa
//    //                });
//    //                delete currentData[employee.MaThe]; // Cập nhật dữ liệu hiện tại
//    //            }
//    //        } else {
//    //            // Nếu trạng thái là fail, thêm thông báo lỗi mới nếu chưa thấy
//    //            if (!seenEmployees.has(employee.MaThe)) {
//    //                seenEmployees.add(employee.MaThe); // Đánh dấu mã thẻ là đã thấy

//    //                // Kiểm tra xem người đó đã có thông báo lỗi chưa
//    //                if (!currentData[employee.MaThe]) {
//    //                    // Tạo phần tử thông báo lỗi mới
//    //                    var alertItem = $(`
//    //                    <div class="alert-item" data-maThe="${employee.MaThe}">
//    //                        <table>
//    //                            <thead>
//    //                                <tr>
//    //                                    <th>Mã thẻ<br />卡码</th>
//    //                                    <th>Họ tên<br />姓名</th>
//    //                                    <th>Bộ phận<br />部分</th>
//    //                                    <th>Trạng thái<br />地位</th>
//    //                                    <th>Thời gian<br />时间</th>
//    //                                </tr>
//    //                            </thead>
//    //                            <tbody>
//    //                                <tr class="fail"> <!-- Thêm lớp fail vào hàng nếu fail -->
//    //                                    <td>${employee.MaThe}</td>
//    //                                    <td>${employee.HoTen}</td>
//    //                                    <td>${employee.TenBoPhan}</td>
//    //                                    <td>${employee.ErrorCode}</td>
//    //                                    <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
//    //                                </tr>
//    //                            </tbody>
//    //                        </table>
//    //                    </div>
//    //                `);
//    //                    // Thêm thông báo lỗi vào đầu danh sách
//    //                    alertQueue.prepend(alertItem);
//    //                    alertItem.fadeIn(); // Hiển thị thông báo

//    //                    // Cập nhật dữ liệu hiện tại với thông báo lỗi mới
//    //                    currentData[employee.MaThe] = alertItem;

//    //                    adjustAlertSize(); // Điều chỉnh kích thước sau khi thêm mới
//    //                }
//    //            }
//    //        }
//    //    });

//    //    // Cập nhật tiêu đề của các thông báo
//    //    if (alertItems.length > 1) {
//    //        alertItems.find('thead').show(); // Ẩn tiêu đề nếu có nhiều hơn 1 thông báo
//    //    } else {
//    //        alertItems.find('thead').show(); // Hiển thị tiêu đề nếu chỉ có 1 thông báo
//    //    }
//    //}


//    //Phương thức được gọi khi có dữ liệu mới từ SignalR
//    function updateAlerts(employeeData) {
//        var seenEmployees = new Set(); // Set để theo dõi các mã thẻ đã thấy

//        // Lặp qua dữ liệu mới để cập nhật thông báo
//        $.each(employeeData, function (index, employee) {
//            var errorCode = employee.ErrorCode.toLowerCase(); // Chuyển mã lỗi thành chữ thường

//            // Nếu trạng thái là pass, xóa thông báo lỗi liên quan
//            if (errorCode === 'pass') {
//                // Xóa tất cả thông báo lỗi liên quan đến người dùng có mã thẻ này
//                var alertItem = currentData[employee.MaThe];
//                if (alertItem) {
//                    alertItem.fadeOut(function () {
//                        alertItem.remove(); // Xóa phần tử thông báo sau khi ẩn
//                        adjustAlertSize(); // Điều chỉnh kích thước sau khi xóa
//                    });
//                    delete currentData[employee.MaThe]; // Cập nhật dữ liệu hiện tại
//                }
//            } else {
//                // Nếu trạng thái là fail, kiểm tra và thêm thông báo lỗi mới nếu chưa thấy
//                if (!seenEmployees.has(employee.MaThe)) {
//                    seenEmployees.add(employee.MaThe); // Đánh dấu mã thẻ là đã thấy

//                    // Kiểm tra xem người đó đã có thông báo lỗi chưa
//                    var existingAlertItem = currentData[employee.MaThe];
//                    if (existingAlertItem) {
//                        // Cập nhật dữ liệu trong thông báo hiện tại
//                        existingAlertItem.find('tbody').html(`
//                        <tr class="fail">
//                            <td>${employee.MaThe}</td>
//                            <td>${employee.HoTen}</td>
//                            <td>${employee.TenBoPhan}</td>
//                            <td>${employee.ErrorCode}</td>
//                            <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
//                        </tr>
//                    `);
//                        existingAlertItem.fadeIn(); // Hiển thị thông báo đã cập nhật
//                    } else {
//                        // Tạo phần tử thông báo lỗi mới
//                        var alertItem = $(`
//                        <div class="alert-item" data-maThe="${employee.MaThe}">
//                            <table>
//                                <thead>
//                                    <tr>
//                                        <th>Mã thẻ<br />卡码</th>
//                                        <th>Họ tên<br />姓名</th>
//                                        <th>Bộ phận<br />部分</th>
//                                        <th>Trạng thái<br />地位</th>
//                                        <th>Thời gian<br />时间</th>
//                                    </tr>
//                                </thead>
//                                <tbody>
//                                    <tr class="fail">
//                                        <td>${employee.MaThe}</td>
//                                        <td>${employee.HoTen}</td>
//                                        <td>${employee.TenBoPhan}</td>
//                                        <td>${employee.ErrorCode}</td>
//                                        <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
//                                    </tr>
//                                </tbody>
//                            </table>
//                        </div>
//                    `);

//                        // Thêm thông báo lỗi vào đầu danh sách
//                        alertQueue.prepend(alertItem);
//                        alertItem.fadeIn(); // Hiển thị thông báo

//                        // Cập nhật dữ liệu hiện tại với thông báo lỗi mới
//                        currentData[employee.MaThe] = alertItem;

//                        adjustAlertSize(); // Điều chỉnh kích thước sau khi thêm mới
//                    }
//                }
//            }
//        });

//        // Thêm tiêu đề vào bảng nếu có dữ liệu mới và tiêu đề chưa được thêm
//        if (employeeData.length > 0 && alertQueue.find('thead').length === 0) {
//            alertQueue.find('.alert-item').each(function () {
//                var table = $(this).find('table');

//                // Nếu bảng chưa có tiêu đề, thêm tiêu đề vào bảng
//                if (table.find('thead').length === 0) {
//                    table.prepend(`
//                    <thead>
//                        <tr>
//                            <th>Mã thẻ<br />卡码</th>
//                            <th>Họ tên<br />姓名</th>
//                            <th>Bộ phận<br />部分</th>
//                            <th>Trạng thái<br />地位</th>
//                            <th>Thời gian<br />时间</th>
//                        </tr>
//                    </thead>
//                `);
//                }
//            });
//        }
//    }





//    employeeHub.client.updateEmployeeData = function (employeeData) {
//        console.log('Received data:', employeeData); // Ghi log dữ liệu nhận được

//        // Cập nhật thông báo với dữ liệu mới
//        updateAlerts(employeeData);
//    };

//    // Bắt đầu kết nối với SignalR Hub khi trang được tải xong
//    $.connection.hub.start().done(function () {
//        console.log('SignalR connected.'); // Ghi log khi kết nối thành công

//        // Làm mới dữ liệu mỗi 10 giây
//        setInterval(function () {
//            employeeHub.server.getEmployeeData(); // Gọi phương thức của máy chủ để lấy dữ liệu mới
//        }, 10000); // 10000ms = 10 giây
//    });
//});


$(function () {
    var employeeHub = $.connection.employeeHub;
    var alertQueue = $('#alertContainer'); // Phần tử chứa thông báo
    var currentData = {}; // Đối tượng lưu trữ trạng thái thông báo hiện tại, dùng mã thẻ làm khóa

    // Hàm ẩn hoặc xóa bảng nếu không còn thông báo
    function checkAndHideTable() {
        if (alertQueue.find('tbody tr').length === 0) {
            alertQueue.hide(); // Ẩn phần tử alertQueue nếu không có dữ liệu
        }
    }

    // Hàm tạo hoặc cập nhật bảng
    function createTableIfNeeded() {
        if (alertQueue.find('table').length === 0) {
            // Tạo bảng mới nếu chưa có
            alertQueue.append(`
                <table class="alert-item">
                    <thead>
                        <tr>
                            <th>Mã thẻ<br />卡码</th>
                            <th>Họ tên<br />姓名</th>
                            <th>Bộ phận<br />部分</th>
                            <th>Trạng thái<br />地位</th>
                            <th>Thời gian<br />时间</th>
                        </tr>
                    </thead>
                    <tbody id="alert-body"></tbody> <!-- Thay đổi ID ở đây -->
                </table>
            `);
        }
        alertQueue.show(); // Hiển thị bảng
    }

    // Hàm tính số lượng hàng tối đa dựa trên chiều cao màn hình
    function calculateMaxRows() {
        var windowHeight = $(window).height(); // Chiều cao của cửa sổ
        console.log("Chiều chao của màn hình"+windowHeight)
        var headerHeight = $('header').outerHeight(true); // Chiều cao của header (có thể có)
        var footerHeight = $('footer').outerHeight(true); // Chiều cao của footer (có thể có)
        var rowHeight = 40; // Chiều cao trung bình của một hàng (tùy chỉnh theo thực tế)

        // Tính toán không gian khả dụng giữa header và footer
        var availableHeight = windowHeight - headerHeight - footerHeight;

        // Tính số lượng hàng tối đa có thể hiển thị mà không vượt quá màn hình
        return Math.floor(availableHeight / rowHeight);
    }

    // Hàm tính khoảng cách giữa bảng và footer
    function calculateDistanceToFooter() {
        var $tbody = alertQueue.find('#alert-body');
        var $footer = $('footer');
        var tableBottom = $tbody.offset().top + $tbody.outerHeight(true);
        var footerTop = $footer.offset().top;
        return footerTop - tableBottom;
    }

    // Hàm cập nhật thông báo dựa trên dữ liệu mới
    function updateAlerts(employeeData) {
        var seenEmployees = new Set(); // Set để theo dõi các mã thẻ đã thấy
        var hasData = false; // Biến để kiểm tra xem có dữ liệu không
        var rows = []; // Mảng để lưu trữ hàng dữ liệu

        // Lặp qua dữ liệu mới để cập nhật thông báo
        $.each(employeeData, function (index, employee) {
            var errorCode = employee.ErrorCode.toLowerCase(); // Chuyển mã lỗi thành chữ thường

            // Nếu trạng thái là pass, xóa thông báo lỗi liên quan
            if (errorCode === 'pass') {
                var $alertItem = currentData[employee.MaThe];
                if ($alertItem) {
                    $alertItem.fadeOut(function () {
                        $alertItem.remove(); // Xóa phần tử thông báo sau khi ẩn
                        delete currentData[employee.MaThe]; // Cập nhật dữ liệu hiện tại
                        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không còn thông báo
                    });
                }
            } else {
                // Nếu trạng thái là fail, kiểm tra và thêm thông báo lỗi mới nếu chưa thấy
                hasData = true; // Đặt cờ có dữ liệu
                if (!seenEmployees.has(employee.MaThe)) {
                    seenEmployees.add(employee.MaThe); // Đánh dấu mã thẻ là đã thấy

                    var $existingAlertItem = currentData[employee.MaThe];
                    if ($existingAlertItem) {
                        // Cập nhật hàng dữ liệu trong bảng
                        $existingAlertItem.find('td').eq(1).text(employee.HoTen);
                        $existingAlertItem.find('td').eq(2).text(employee.TenBoPhan);
                        $existingAlertItem.find('td').eq(3).text(employee.ErrorCode);
                        $existingAlertItem.find('td').eq(4).text(moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss'));
                        $existingAlertItem.fadeIn(); // Hiển thị thông báo đã cập nhật
                    } else {
                        // Thêm dữ liệu vào nhóm hàng
                        var $newRow = $(`
                            <tr class="fail">
                                <td>${employee.MaThe}</td>
                                <td>${employee.HoTen}</td>
                                <td>${employee.TenBoPhan}</td>
                                <td>${employee.ErrorCode}</td>
                                <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
                            </tr>
                        `);
                        rows.push($newRow); // Thêm đối tượng jQuery vào mảng hàng
                        currentData[employee.MaThe] = $newRow; // Lưu trữ đối tượng jQuery trong currentData
                    }
                }
            }
        });

        // Thêm tất cả các hàng dữ liệu vào tbody
        if (rows.length > 0) {
            var $tbody = alertQueue.find('#alert-body');
            $tbody.prepend(rows); // Thêm các hàng dữ liệu vào đầu tbody

            // Kiểm tra nếu số lượng hàng quá lớn và xóa hàng cuối cùng
            var maxRows = calculateMaxRows(); // Tính lại số lượng hàng tối đa khi kích thước cửa sổ thay đổi
            if ($tbody.find('tr').length > maxRows) {
                $tbody.find('tr:last').remove(); // Xóa hàng cuối cùng nếu vượt quá số lượng
            }

            // Xóa hàng nếu gần đến footer
            var distanceToFooter = calculateDistanceToFooter();
            if (distanceToFooter < 0) { // Nếu khoảng cách âm, có nghĩa là bảng gần chạm footer
                var excessRows = Math.ceil(Math.abs(distanceToFooter) / 40); // Tính số lượng hàng cần xóa
                $tbody.find('tr').slice(-excessRows).remove(); // Xóa hàng cuối cùng
            }
        }

        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không có dữ liệu
    }

    // Gọi hàm này khi kích thước cửa sổ thay đổi để cập nhật số lượng hàng tối đa
    $(window).resize(function () {
        calculateMaxRows(); // Tính lại số lượng hàng tối đa khi kích thước cửa sổ thay đổi
    });

    // Nhận dữ liệu mới từ SignalR Hub
    employeeHub.client.updateEmployeeData = function (employeeData) {
        console.log('Received data:', employeeData); // Ghi log dữ liệu nhận được
        createTableIfNeeded(); // Tạo bảng nếu chưa có
        updateAlerts(employeeData); // Cập nhật thông báo với dữ liệu mới
    };

    // Bắt đầu kết nối với SignalR Hub khi trang được tải xong
    $.connection.hub.start().done(function () {
        console.log('SignalR connected.'); // Ghi log khi kết nối thành công

        // Làm mới dữ liệu mỗi 5 giây
        setInterval(function () {
            employeeHub.server.getEmployeeData(); // Gọi phương thức của máy chủ để lấy dữ liệu mới
        }, 5000); // 5000ms = 5 giây
    });
});






